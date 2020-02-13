const blake = require('blakejs')
const base64check = require('base64check')
const Serializer = require('./Serializer.js')
const ArgumentsResolver = require('./ArgumentsResolver.js')

const HASH_BYTES = 32
const PRIMITIVE_TYPES = ['bool', 'int', 'string']

const zip = (arr, ...arrs) => {
  return arr.map((val, i) => arrs.reduce((a, arr) => [...a, arr[i]], [val]));
}

const isObject = (value) => {
    return value && typeof value === 'object' && value.constructor === Object;
}

Encoder = function (aci) {
    this.aci = aci
    this.resolver = new ArgumentsResolver(aci)
    this.serializer = Object.create(Serializer)
}

Encoder.prototype = {
    encode: function (funcName, args) {
        return 'cb_' + base64check.encode(this.serialize(funcName, args))
    },

    serialize: function (funName, args) {
        if (!this.hasFunction(funName)) {
            throw new Error(`Unknown function call: ${funName}`)
        }

        const functionId = this.symbolIdentifier(funName)
        const resolvedArgs = this.resolver.resolveArguments(funName, args)

        const calldata = ['tuple', [
                ['byte_array', functionId],
                ['tuple', resolvedArgs]
        ]]

        const serialized = this.serializer.serialize(calldata)

        return new Uint8Array(serialized.flat(Infinity))
    },

    symbolIdentifier: function (funName) {
        // First 4 bytes of 32 bytes blake hash
        hash = Array.from(blake.blake2b(funName, null, HASH_BYTES))

        return hash.slice(0, 4)
    },

    hasFunction(funName) {
        // implicit init function always exists (contract constructor)
        if (funName == 'init') {
            return true
        }

        const funcAci = this.aci.functions.find(e => e.name == funName)
        if (funcAci) {
            return true
        }

        return false
    }
}

module.exports = Encoder

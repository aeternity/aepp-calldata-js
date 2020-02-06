const fs = require('fs')
const blake = require('blakejs')
const base64check = require('base64check')
const Serializer = require('./Serializer.js')

const HASH_BYTES = 32
const serializer = Object.create(Serializer)

const zip = (arr, ...arrs) => {
  return arr.map((val, i) => arrs.reduce((a, arr) => [...a, arr[i]], [val]));
}

const isObject = (value) => {
    return value && typeof value === 'object' && value.constructor === Object;
}

Encoder = function (aci) {
    this.aci = aci
}

Encoder.prototype = {
    encode: function (funcName, args) {
        return 'cb_' + base64check.encode(this.serialize(funcName, args))
    },

    serialize: function (funName, args) {
        const functionId = this.symbolIdentifier(funName)
        const resolvedArgs = this.resolveArguments(funName, args)

        const calldata = ['tuple', [
                ['byte_array', functionId],
                ['tuple', resolvedArgs]
        ]]

        const serialized = serializer.serialize(calldata)

        return new Uint8Array(serialized.flat(Infinity))
    },

    resolveArguments: function (funName, args) {
        const contractAci = this.aci
        const funcAci = contractAci.functions.find(e => e.name == funName)
        const argAci = (funcAci) ? funcAci.arguments : []

        let resolvedArgs = []
        for (let i = 0; i < argAci.length; i++) {
            resolvedArgs.push(
                this.resolveArgument(argAci[i].type, args[i])
            )
        }

        return resolvedArgs
    },

    resolveArgument(type, value) {
        // composite types
        if (isObject(type)) {
            const key = Object.keys(type)[0]
            const valueTypes = type[key]

            if (key === 'list') {
                return [key, valueTypes[0], value]
            }

            const values = zip(valueTypes, value).map(el => {
                const [t, v] = el
                return this.resolveArgument(t, v)
            })

            return [key, values]
        }

        // simple types
        return [type, value]
    },

    symbolIdentifier: function (funName) {
        // First 4 bytes of 32 bytes blake hash
        hash = Array.from(blake.blake2b(funName, null, HASH_BYTES))

        return hash.slice(0, 4)
    }
}

module.exports = Encoder

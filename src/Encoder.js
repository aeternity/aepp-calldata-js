const blake = require('blakejs')
const base64check = require('base64check')
const Serializer = require('./Serializer.js')
const ArgumentsResolver = require('./ArgumentsResolver.js')
const {FateTypeByteArray} = require('./FateTypes.js')
const FateTuple = require('./types/FateTuple.js')

const HASH_BYTES = 32

Encoder = function (aci) {
    this.aci = aci
    this.resolver = new ArgumentsResolver(aci)
    this.serializer = Object.create(Serializer)
}

Encoder.prototype = {
    encode: function (funName, args) {
        return 'cb_' + base64check.encode(this.serialize(funName, args))
    },

    serialize: function (funName, args) {
        const argTypes = this.getArgumentTypes(funName)
        const functionId = this.symbolIdentifier(funName)
        const resolvedArgs = this.resolver.resolveArguments(argTypes, args)

        // isArray check for BC
        const tupleTypes = resolvedArgs.map(e => Array.isArray(e) ? e[1] : e.type)
        const tupleValues = resolvedArgs.map(e => Array.isArray(e) ? e[2] : e)

        const argsTuple = new FateTuple(tupleTypes, tupleValues)
        const calldata = new FateTuple(
            [FateTypeByteArray(), argsTuple.type],
            [functionId, argsTuple]
        )

        const serialized = this.serializer.serialize(calldata)

        return new Uint8Array(serialized.flat(Infinity))
    },

    symbolIdentifier: function (funName) {
        // First 4 bytes of 32 bytes blake hash
        hash = Array.from(blake.blake2b(funName, null, HASH_BYTES))

        return hash.slice(0, 4)
    },

    getArgumentTypes(funName) {
        const funcAci = this.aci.functions.find(e => e.name == funName)

        if (funcAci) {
            return funcAci.arguments.map(e => e.type)
        }

        if (funName === 'init') {
            return []
        }

        throw new Error(`Unknown function ${funName}`)
    }
}

module.exports = Encoder

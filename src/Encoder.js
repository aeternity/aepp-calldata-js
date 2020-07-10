const blake = require('blakejs')
const base64check = require('base64check')
const Serializer = require('./Serializer.js')
const FateByteArray = require('./types/FateByteArray.js')
const FateTuple = require('./types/FateTuple.js')
const TypeResolver = require('./TypeResolver.js')
const DataFactory = require('./DataFactory.js')

const HASH_BYTES = 32

Encoder = function (aci) {
    this.aci = aci
    this.serializer = new Serializer()
    this.typeResolver = new TypeResolver(aci)
    this.dataFactory = new DataFactory(aci)
}

Encoder.prototype = {
    encode: function (contract, funName, args) {
        return 'cb_' + base64check.encode(this.serialize(contract, funName, args))
    },

    decode: function (contract, funName, data) {
        if (!data.startsWith('cb_')) {
            throw new Error('Invalid data format (missing cb_ prefix)')
        }

        const binData = base64check.decode(data.substring(3))
        const deserialized = this.deserialize(contract, funName, binData)

        return deserialized.valueOf()
    },

    serialize: function (contract, funName, args) {
        const functionId = this.symbolIdentifier(funName)
        const argTypes = this.typeResolver.getCallTypes(contract, funName)
        const argsData = this.dataFactory.create(argTypes, args)

        const funcBytes = new FateByteArray(functionId)
        const argsTuple = new FateTuple(argTypes, argsData)
        const calldata = new FateTuple(
            [funcBytes.type, argsTuple.type],
            [funcBytes, argsTuple]
        )

        const serialized = this.serializer.serialize(calldata)

        return new Uint8Array(serialized.flat(Infinity))
    },

    deserialize: function (contract, funName, data) {
        const type = this.typeResolver.getReturnType(contract, funName)

        return this.serializer.deserialize(type, data)
    },

    symbolIdentifier: function (funName) {
        // First 4 bytes of 32 bytes blake hash
        hash = Array.from(blake.blake2b(funName, null, HASH_BYTES))

        return hash.slice(0, 4)
    },
}

module.exports = Encoder

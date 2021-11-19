const blake = require('blakejs')
const base64check = require('base64check')
const Serializer = require('./Serializer')
const FateByteArray = require('./types/FateByteArray')
const FateTuple = require('./types/FateTuple')
const TypeResolver = require('./TypeResolver')
const DataFactory = require('./DataFactory')

const HASH_BYTES = 32

class Encoder {
    constructor(aci) {
        this.aci = aci
        this.serializer = new Serializer()
        this.typeResolver = new TypeResolver(aci)
        this.dataFactory = new DataFactory(aci)
    }
    encode(contract, funName, args) {
        return 'cb_' + base64check.encode(this.serialize(contract, funName, args))
    }
    decode(contract, funName, data) {
        return this.decodeWithType(contract, funName, data).valueOf()
    }
    decodeWithType(contract, funName, data) {
        if (!data.startsWith('cb_')) {
            throw new Error('Invalid data format (missing cb_ prefix)')
        }

        const binData = base64check.decode(data.substring(3))

        return this.deserialize(contract, funName, binData)
    }
    serialize(contract, funName, args) {
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
    }
    deserialize(contract, funName, data) {
        const type = this.typeResolver.getReturnType(contract, funName)

        return this.serializer.deserialize(type, data)
    }
    symbolIdentifier(funName) {
        // First 4 bytes of 32 bytes blake hash
        const hash = Array.from(blake.blake2b(funName, null, HASH_BYTES))

        return hash.slice(0, 4)
    }
}

module.exports = Encoder

const base64check = require('base64check')
const Serializer = require('./Serializer')
const TypeResolver = require('./TypeResolver')
const DataFactory = require('./DataFactory')
const Calldata = require('./Calldata')
const {FateTypeString} = require('./FateTypes')

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
        const binData = this.decodeString(data)

        return this.deserialize(contract, funName, binData).valueOf()
    }

    serialize(contract, funName, args) {
        const argTypes = this.typeResolver.getCallTypes(contract, funName)
        const argsData = this.dataFactory.create(argTypes, args)
        const calldata = Calldata(funName, argTypes, argsData)

        const serialized = this.serializer.serialize(calldata)

        return new Uint8Array(serialized.flat(Infinity))
    }

    deserialize(contract, funName, data) {
        const type = this.typeResolver.getReturnType(contract, funName)

        return this.serializer.deserialize(type, data)
    }

    decodeString(data) {
        if (!data.startsWith('cb_')) {
            throw new Error('Invalid data format (missing cb_ prefix)')
        }

        return base64check.decode(data.substring(3))
    }

    decodeFateString(data) {
        const binData = this.decodeString(data)

        return this.serializer.deserialize(FateTypeString(), binData).valueOf()
    }
}

module.exports = Encoder

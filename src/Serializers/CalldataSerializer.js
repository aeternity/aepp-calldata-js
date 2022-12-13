const FateTuple = require('../types/FateTuple')
const FateCalldata = require('../types/FateCalldata')
const FateByteArray = require('../types/FateByteArray')
const BaseSerializer = require('./BaseSerializer')
const {FateTypeTuple, FateTypeByteArray} = require('../FateTypes')

class CalldataSerializer extends BaseSerializer {
    serialize(calldata) {
        const funcBytes = new FateByteArray(calldata.functionId)
        const argsTuple = new FateTuple(calldata.argTypes, calldata.args)

        const calldataTuple = new FateTuple(
            [funcBytes.type, argsTuple.type],
            [funcBytes, argsTuple]
        )

        return this.globalSerializer.serialize(calldataTuple)
    }

    deserialize(data, typeInfo) {
        const calldataType = FateTypeTuple([
            FateTypeByteArray(),
            FateTypeTuple(typeInfo.argumentTypes)
        ])

        const [calldataTuple,] = this.globalSerializer.deserializeStream(data, calldataType)
        const [functionId, argsTuple] = calldataTuple.items

        return new FateCalldata(functionId.valueOf(), argsTuple.valueTypes, argsTuple.items)
    }
}

module.exports = CalldataSerializer

import FateTuple from '../types/FateTuple.js'
import FateCalldata from '../types/FateCalldata.js'
import FateByteArray from '../types/FateByteArray.js'
import BaseSerializer from './BaseSerializer.js'
import {FateTypeTuple, FateTypeByteArray} from '../FateTypes.js'

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

export default CalldataSerializer

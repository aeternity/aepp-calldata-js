import {symbolIdentifier} from '../utils/hash.js'
import FateTypeError from '../Errors/FateTypeError.js'
import FateCalldata from '../types/FateCalldata.js'
import BaseDataFactory from './BaseDataFactory.js'

class CallDataFactory extends BaseDataFactory {
    supports({ name, _valueTypes }) {
        return 'calldata' === name
    }

    create(type, value) {
        if (!Array.isArray(value)) {
            throw new FateTypeError(
                type.name,
                `Fate calldata arguments must be an Array, got ${value} instead`
            )
        }

        const argsData = this.valueFactory.createMultiple(type.argumentTypes, value)
        const functionId = symbolIdentifier(type.functionName)

        return new FateCalldata(functionId, type.argumentTypes, argsData)
    }
}

export default CallDataFactory

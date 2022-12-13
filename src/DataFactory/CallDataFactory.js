const {symbolIdentifier} = require('../utils/hash')
const FateTypeError = require('../Errors/FateTypeError')
const FateCalldata = require('../types/FateCalldata')
const BaseDataFactory = require('./BaseDataFactory')

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

module.exports = CallDataFactory

const {symbolIdentifier} = require('../utils/hash')
const FateTypeError = require('../Errors/FateTypeError')
const FateByteArray = require('../types/FateByteArray')
const FateTuple = require('../types/FateTuple')
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

        const argTypes = type.argumentTypes
        const argsData = this.valueFactory.createMultiple(argTypes, value)
        const functionId = symbolIdentifier(type.functionName)
        const funcBytes = new FateByteArray(functionId)
        const argsTuple = new FateTuple(argTypes, argsData)

        return new FateTuple(
            [funcBytes.type, argsTuple.type],
            [funcBytes, argsTuple]
        )
    }
}

module.exports = CallDataFactory

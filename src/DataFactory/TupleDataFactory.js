const FateTuple = require('../types/FateTuple')
const FateTypeError = require('../Errors/FateTypeError')
const BaseDataFactory = require('./BaseDataFactory')

class TupleDataFactory extends BaseDataFactory {
    supports({ name, _valueTypes }) {
        return 'tuple' === name
    }

    create(type, value) {
        if (!Array.isArray(value)) {
            throw new FateTypeError(
                type.name,
                `Fate tuple must be an Array, got ${value} instead`
            )
        }

        const resolvedValue = type.valueTypes.map((t, i) => {
            return this.valueFactory.createData(t, value[i])
        })

        return new FateTuple(type.valueTypes, resolvedValue)
    }
}

module.exports = TupleDataFactory

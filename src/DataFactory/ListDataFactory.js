const FateList = require('../types/FateList')
const FateTypeError = require('../Errors/FateTypeError')
const BaseDataFactory = require('./BaseDataFactory')

class ListDataFactory extends BaseDataFactory {
    supports({name, _valueTypes}) {
        return 'list' === name
    }

    create(type, value) {
        if (!Array.isArray(value)) {
            throw new FateTypeError(
                type.name,
                `Fate list must be an Array, got ${value} instead`
            )
        }

        const resolvedValues = value.map(v => this.valueFactory.create(type.valuesType, v))

        return new FateList(type.valuesType, resolvedValues)
    }
}

module.exports = ListDataFactory

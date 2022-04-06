const FateSet = require('../types/FateSet')
const BaseDataFactory = require('./BaseDataFactory')

class SetDataFactory extends BaseDataFactory {
    supports({name, _valueTypes}) {
        return 'set' === name
    }

    create(type, value) {
        const resolvedValues = []
        for (const item of value) {
            resolvedValues.push(this.valueFactory.create(type.valuesType, item))
        }

        return new FateSet(type.valuesType, resolvedValues)
    }
}

module.exports = SetDataFactory

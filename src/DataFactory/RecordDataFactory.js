const FateTuple = require('../types/FateTuple')
const BaseDataFactory = require('./BaseDataFactory')

class RecordDataFactory extends BaseDataFactory {
    supports({ name, _valueTypes }) {
        return 'record' === name
    }

    create(type, value) {
        const resolvedValue = type.valueTypes.map((t, i) => {
            const key = type.keys[i]
            return this.valueFactory.create(t, value[key])
        })

        return new FateTuple(type.valueTypes, resolvedValue)
    }
}

module.exports = RecordDataFactory

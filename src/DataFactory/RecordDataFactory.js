const BaseDataFactory = require('./BaseDataFactory')
const FateTuple = require('../types/FateTuple')
const {FateTypeRecord} = require('../FateTypes')
const FateTypeError = require('../Errors/FateTypeError')
const isOptionVariant = require('../utils/isOptionVariant')
const zip = require('../utils/zip')

class RecordDataFactory extends BaseDataFactory {
    supports({ name, _valueTypes }) {
        return 'record' === name
    }

    create(type, value) {
        if (typeof value !== 'object') {
            throw new FateTypeError(
                type.name,
                `Fate record must be an Object, got ${value} instead`
            )
        }

        const missedKeys = zip(type.keys, type.valueTypes)
            .filter(([, valueType]) => !isOptionVariant(valueType))
            .map(([name]) => name)
            .filter((name) => !(name in value))
        if (missedKeys.length) {
            throw new FateTypeError(type.name, `Missed required keys: ${missedKeys.join(', ')}`)
        }

        const resolvedValue = type.valueTypes.map((t, i) => {
            const key = type.keys[i]
            return this.valueFactory.create(t, value[key])
        })

        // Unbox singleton tuples and records
        // https://github.com/aeternity/aesophia/pull/205
        // https://github.com/aeternity/aesophia/commit/a403a9d227ac56266cf5bb8fbc916f17e6141d15
        if (resolvedValue.length === 1) {
            return resolvedValue[0]
        }

        return new FateTuple(
            FateTypeRecord(type.keys, type.valueTypes),
            resolvedValue
        )
    }
}

module.exports = RecordDataFactory

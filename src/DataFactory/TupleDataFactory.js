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
            return this.valueFactory.create(t, value[i])
        })

        // Unbox singleton tuples and records
        // https://github.com/aeternity/aesophia/pull/205
        // https://github.com/aeternity/aesophia/commit/a403a9d227ac56266cf5bb8fbc916f17e6141d15
        if (resolvedValue.length === 1) {
            return resolvedValue[0]
        }

        return new FateTuple(type.valueTypes, resolvedValue)
    }
}

module.exports = TupleDataFactory

const {hash} = require('../utils/hash')
const {ByteArray2Int} = require('../utils/Int2ByteArray')
const TypeResolveError = require('../Errors/TypeResolveError')
const BaseDataFactory = require('./BaseDataFactory')

const DATA_TYPES = [
    'string',
    'signature',
    'bytes',
]

class EventDataFactory extends BaseDataFactory {
    constructor(valueFactory, variantFactory) {
        super(valueFactory)

        this._variantFactory = variantFactory
    }

    supports({ name, _valueTypes }) {
        return 'event' === name
    }

    create({variantType}, {data, topics}) {
        const [nameHash, ...args] = topics

        if (typeof nameHash !== 'bigint') {
            throw new TypeResolveError(`Event name hash (first topic) should be of type "BigInt", got "${typeof nameHash}" instead.`)
        }

        const idx = variantType.variants
            .map(v => ByteArray2Int(hash(Object.keys(v)[0])))
            .findIndex(v => v === nameHash)

        if (idx === -1) {
            throw new TypeResolveError('Event name hash does not match any event variant constructor')
        }

        const variant = variantType.variants[idx]
        const variantName = Object.keys(variant)[0]
        const [argTypes] = Object.values(variant)
        const resolvedArgs = argTypes.map(t => {
            if (this._isData(t)) {
                return data
            }

            return args.shift()
        })

        return this._variantFactory.create(variantType, {[variantName]: resolvedArgs})
    }

    _isData(type) {
        if (!DATA_TYPES.includes(type.name)) {
            return false
        }

        if (type.name === 'bytes' && type.size <= 32) {
            return false
        }

        return true
    }
}

module.exports = EventDataFactory

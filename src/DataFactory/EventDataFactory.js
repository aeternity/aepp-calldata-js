const {hash} = require('../utils/hash')
const {byteArray2Int} = require('../utils/int2ByteArray')
const TypeResolveError = require('../Errors/TypeResolveError')
const BaseDataFactory = require('./BaseDataFactory')

const DATA_TYPES = [
    'string',
    'signature',
    'bytes',
]

class EventDataFactory extends BaseDataFactory {
    supports({ name, _valueTypes }) {
        return 'event' === name
    }

    create({variantType, topics}, data) {
        const [nameHash, ...args] = topics

        if (typeof nameHash !== 'bigint') {
            throw new TypeResolveError(`Event name hash (first topic) should be of type "BigInt", got "${typeof nameHash}" instead.`)
        }

        const idx = variantType.variants
            .map(v => byteArray2Int(hash(Object.keys(v)[0])))
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

        return this.valueFactory.create(variantType, {[variantName]: resolvedArgs})
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

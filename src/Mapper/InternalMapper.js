const base58check = require('../utils/base58check')
const FateTypeError = require('../Errors/FateTypeError')

const ADDRESS_PREFIX_MAP = {
    account_address: 'ak',
    contract_address: 'ct',
    channel_address: 'ch',
    oracle_address: 'ok',
    oracle_query_address: 'oq'
}

/**
 * Map Aesophia canonical structures and formats to internal representation FATE data structures.
 */
class InternalMapper {
    toInternal(type, value) {
        switch (type.name) {
        case 'account_address':
        case 'contract_address':
        case 'channel_address':
        case 'oracle_address':
        case 'oracle_query_address':
            return this.toAddress(type, value)
        case 'variant':
            return this.toVariant(type, value)
        case 'map':
            return this.toMap(type, value)
        default:
            return value
        }
    }

    toAddress({name, _}, value) {
        const asString = value.toString()
        const prefix = ADDRESS_PREFIX_MAP[name]

        if (!asString.startsWith(prefix + '_')) {
            throw new FateTypeError(
                name,
                `Address should start with ${prefix}_, got ${asString} instead`
            )
        }

        return base58check.decode(asString.substring(prefix.length + 1))
    }

    toVariant(type, value) {
        if (!this.isOptionVariant(type)) {
            return value
        }

        if ([undefined, null].includes(value)) {
            return {None: []}
        }

        const [variantName] = Object.keys(value)
        if (['Some', 'None'].includes(variantName)) {
            return value
        }

        return {Some: [value]}
    }

    isOptionVariant({ _name, variants }) {
        return variants.some(({ None }) => None && None.length === 0)
            && variants.some(({ Some }) => Some)
    }

    toMap(type, value) {
        if (typeof value !== 'object' || value === null) {
            throw new FateTypeError(
                'map',
                `Fate map must be one of: Map, Array, Object; got ${value} instead`
            )
        }

        return Array.isArray(value) || value instanceof Map ? value : Object.entries(value)
    }
}

module.exports = InternalMapper

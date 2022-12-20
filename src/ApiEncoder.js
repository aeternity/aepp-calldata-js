const base64check = require('./utils/base64check')
const base58check = require('./utils/base58check')
const FormatError = require('./Errors/FormatError')
const FateTypeError = require('./Errors/FateTypeError')

const TYPES = {
    contract_bytearray: {tag: 'cb', size: 0, encoder: base64check},
    contract_pubkey: {tag: 'ct', size: 32, encoder: base58check},
    account_address: {tag: 'ak', size: 32, encoder: base58check},
    channel: {tag: 'ch', size: 32, encoder: base58check},
    oracle_pubkey: {tag: 'ok', size: 32, encoder: base58check},
    oracle_query_id: {tag: 'oq', size: 32, encoder: base58check},
}

const TAG2TYPE = {
    cb: 'contract_bytearray',
    ct: 'contract_pubkey',
    ak: 'account_address',
    ch: 'channel',
    ok: 'oracle_pubkey',
    oq: 'oracle_query_id',
}

class ApiEncoder {
    encode(typeName, payload) {
        if (!TYPES.hasOwnProperty(typeName)) {
            throw new FateTypeError(typeName, `Unsupported API type ${typeName}`)
        }

        const type = TYPES[typeName]

        if (type.size > 0 && payload.length !== type.size) {
            throw new FateTypeError(
                typeName,
                `Invalid payload. Expected size ${type.size}, but got ${payload.length}`
            )
        }

        const encoded = type.encoder.encode(payload)

        return `${type.tag}_${encoded}`
    }

    decode(data) {
        const tag = data.substring(0, 2)

        if (!TAG2TYPE.hasOwnProperty(tag)) {
            throw new FormatError(`Invalid API data format. Unsupported tag: ${tag}`)
        }

        if (data[2] !== '_') {
            throw new FormatError(`Invalid API data format. Expected _ separator on position 2, got ${data[2]}`)
        }

        const type = TYPES[TAG2TYPE[tag]]
        const payload = data.substring(3)
        const decoded = type.encoder.decode(payload)

        if (type.size > 0 && decoded.length !== type.size) {
            throw new FormatError(`Invalid API data format. Expected size ${type.size}, but got ${decoded.length}`)
        }

        return decoded
    }

    decodeWithType(data, expectedType) {
        const tag = data.substring(0, 2)

        if (!TYPES.hasOwnProperty(expectedType)) {
            throw new FateTypeError(expectedType, 'Unsupported API type')
        }

        const expectedTag = TYPES[expectedType].tag

        if (tag !== expectedTag) {
            const capitalized = this.capitalizeType(expectedType)

            throw new FateTypeError(
                expectedType,
                `${capitalized} should start with ${expectedTag}_, got ${data} instead`
            )
        }

        return this.decode(data)
    }

    capitalizeType(type) {
        const s = type.replace('_', ' ')

        return s.charAt(0).toUpperCase() + s.slice(1)
    }
}

module.exports = ApiEncoder

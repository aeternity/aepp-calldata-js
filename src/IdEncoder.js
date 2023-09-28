const TAGS = {
    ACCOUNT_PUBKEY: 1,
    NAME: 2,
    COMMITMENT: 3,
    ORACLE_PUBKEY: 4,
    CONTRACT_PUBKEY: 5,
    CHANNEL: 6,
}

const PREFIX2TAG = {
    'ak': TAGS.ACCOUNT_PUBKEY,
    'nm': TAGS.NAME,
    'cm': TAGS.COMMITMENT,
    'ok': TAGS.ORACLE_PUBKEY,
    'ct': TAGS.CONTRACT_PUBKEY,
    'ch': TAGS.CHANNEL
}

class IdEncoder {
    constructor(apiEncoder) {
        this.apiEncoder = apiEncoder
    }

    encode(value) {
        const [tag, ...rest] = value

        const key = Object.keys(TAGS).find(tagKey => TAGS[tagKey] === tag)
        if (key === undefined) {
            throw new Error('Unsupported ID tag: ' + tag)
        }

        return this.apiEncoder.encode(key.toLowerCase(), rest)
    }

    decode(data) {
        const prefix = data.substring(0, 2)

        if (!PREFIX2TAG.hasOwnProperty(prefix)) {
            throw new Error(`Invalid ID data format. Unsupported prefix: ${prefix}`)
        }

        const tag = PREFIX2TAG[prefix]

        return new Uint8Array([tag, ...this.apiEncoder.decode(data)])
    }
}

module.exports = IdEncoder

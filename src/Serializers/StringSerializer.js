const FateTag = require('../FateTag')
const BaseSerializer = require('./BaseSerializer')
const ByteArraySerializer = require('./ByteArraySerializer')
const FateString = require('../types/FateString')
const FatePrefixError = require('../Errors/FatePrefixError')

const byteArraySerializer = new ByteArraySerializer()

class StringSerializer extends BaseSerializer {
    serialize(value) {
        let bytesOrString = value.valueOf()

        if (typeof bytesOrString === 'string') {
            const encoder = new TextEncoder()
            bytesOrString = encoder.encode(bytesOrString)
        }

        return byteArraySerializer.serialize(bytesOrString)
    }

    deserializeStream(data) {
        const buffer = new Uint8Array(data)
        const prefix = buffer[0]

        if (
            (prefix & 0b11) !== FateTag.SHORT_STRING
            && ![FateTag.EMPTY_STRING, FateTag.LONG_STRING].includes(prefix)
        ) {
            throw new FatePrefixError(prefix)
        }

        const [bytes, rest] = byteArraySerializer.deserializeStream(buffer)

        return [
            new FateString(bytes.valueOf()),
            rest
        ]
    }
}

module.exports = StringSerializer

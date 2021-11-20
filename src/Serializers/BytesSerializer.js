const FateTag = require('../FateTag')
const ByteArraySerializer = require('./ByteArraySerializer')
const FateBytes = require('../types/FateBytes')

const byteArraySerializer = new ByteArraySerializer()

class BytesSerializer {
    serialize(bytes) {
        return [
            FateTag.OBJECT,
            FateTag.OTYPE_BYTES,
            ...byteArraySerializer.serialize(bytes.value)
        ]
    }

    deserialize(data) {
        const [value, _rest] = this.deserializeStream(data)

        return value
    }

    deserializeStream(data) {
        const buffer = new Uint8Array(data)
        const [bytes, rest] = byteArraySerializer.deserializeStream(buffer.slice(2))

        return [
            new FateBytes(bytes.valueOf()),
            rest
        ]
    }
}

module.exports = BytesSerializer

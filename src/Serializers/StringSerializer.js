const FateTag = require('../FateTag.js')
const ByteArraySerializer = require('./ByteArraySerializer.js')
const FateString = require('../types/FateString.js')

const byteArraySerializer = new ByteArraySerializer()

class StringSerializer {
    serialize(value) {
        const encoder = new TextEncoder()
        const bytes = encoder.encode(value)

        return byteArraySerializer.serialize(bytes)
    }
    deserialize(data) {
        const [value, rest] = this.deserializeStream(data)

        return value
    }
    deserializeStream(data) {
        const buffer = new Uint8Array(data)
        const prefix = buffer[0]

        if ((prefix & 0x11) !== FateTag.SHORT_STRING && prefix !== FateTag.LONG_STRING) {
            throw new Error("Unsupported prefix: 0b" + prefix.toString(2).padStart(8, '0'))
        }

        const decoder = new TextDecoder()
        const [bytes, rest] = byteArraySerializer.deserializeStream(buffer)

        return [
            new FateString(decoder.decode(bytes.valueOf())),
            rest
        ]
    }
}

module.exports = StringSerializer

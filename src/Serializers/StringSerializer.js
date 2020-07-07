const FateTag = require('../FateTag.js')
const ByteArraySerializer = require('./ByteArraySerializer.js')

const byteArraySerializer = new ByteArraySerializer()

class StringSerializer {
    serialize(value) {
        const encoder = new TextEncoder()
        const bytes = encoder.encode(value)

        return byteArraySerializer.serialize(bytes)
    }
    deserialize(data) {
        const decoder = new TextDecoder()
        const bytes = byteArraySerializer.deserialize(data)

        return decoder.decode(bytes.valueOf())
    }
}

module.exports = StringSerializer

const FateTag = require('../FateTag.js')
const Int2ByteArray = require('../utils/Int2ByteArray.js')
const ByteArraySerializer = require('./ByteArraySerializer.js')
const FateBytes = require('../types/FateBytes.js')

const byteArraySerializer = new ByteArraySerializer()

class BytesSerializer {
    serialize(bytes) {
        return [
            FateTag.OBJECT,
            FateTag.OTYPE_BYTES,
            ...byteArraySerializer.serialize(bytes.valueOf())
        ]
    }
    deserialize(data) {
        const buffer = new Uint8Array(data)
        const bytes = byteArraySerializer.deserialize(buffer.slice(2))

        return new FateBytes(bytes.valueOf())
    }
}

module.exports = BytesSerializer

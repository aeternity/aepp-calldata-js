import FateTag from '../FateTag.js'
import ByteArraySerializer from './ByteArraySerializer.js'
import FateBytes from '../types/FateBytes.js'
import BaseSerializer from './BaseSerializer.js'

const byteArraySerializer = new ByteArraySerializer()

class BytesSerializer extends BaseSerializer {
    serialize(bytes) {
        return [
            FateTag.OBJECT,
            FateTag.OTYPE_BYTES,
            ...byteArraySerializer.serialize(bytes.value)
        ]
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

export default BytesSerializer

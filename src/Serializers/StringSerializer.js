import FateTag from '../FateTag.js'
import BaseSerializer from './BaseSerializer.js'
import ByteArraySerializer from './ByteArraySerializer.js'
import FateString from '../types/FateString.js'
import FatePrefixError from '../Errors/FatePrefixError.js'

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

export default StringSerializer

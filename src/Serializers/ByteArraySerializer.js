const FateTag = require('../FateTag')
const BaseSerializer = require('./BaseSerializer')
const FateByteArray = require('../types/FateByteArray')
const IntSerializer = require('./IntSerializer')

const intSerializer = new IntSerializer()

class ByteArraySerializer extends BaseSerializer {
    serialize(data) {
        if (data.length === 0) {
            return [FateTag.EMPTY_STRING]
        }

        if (data.length < 64) {
            const prefix = (data.length << 2) | FateTag.SHORT_STRING

            return [
                prefix,
                ...data.valueOf()
            ]
        }

        return [
            FateTag.LONG_STRING,
            ...intSerializer.serialize(data.length - 64),
            ...data.valueOf()
        ]
    }

    deserializeStream(stream) {
        const data = new Uint8Array(stream)
        const prefix = data[0]

        if (prefix === FateTag.EMPTY_STRING) {
            return [
                new FateByteArray(),
                data.slice(1)
            ]
        }

        if (prefix === FateTag.LONG_STRING) {
            const [fateLen, rest] = intSerializer.deserializeStream(data.slice(1))
            const len = Number(fateLen.valueOf()) + 64

            return [
                new FateByteArray(rest.slice(0, len)),
                rest.slice(len)
            ]
        }

        // short string
        const offset = (prefix >> 2) + 1

        return [
            new FateByteArray(data.slice(1, offset)),
            data.slice(offset)
        ]
    }
}

module.exports = ByteArraySerializer

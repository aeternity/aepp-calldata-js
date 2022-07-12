const FateTag = require('../FateTag')
const RLPInt = require('../utils/RLPInt')
const FateInt = require('../types/FateInt')
const BaseSerializer = require('./BaseSerializer')
const FatePrefixError = require('../Errors/FatePrefixError')
const abs = require('../utils/abs')

const SMALL_INT_MASK = 0b00000001

class IntSerializer extends BaseSerializer {
    serialize(data) {
        const bigValue = (data instanceof FateInt) ? data.value : BigInt(data)
        const absVal = abs(bigValue)

        // small integer
        if (absVal < 64) {
            const small = Number(absVal)
            if (bigValue >= 0) {
                return [(small << 1)]
            }

            // negative
            return [(0b10000000 | (small << 1)) & 0b11111110]
        }

        // large negative integer
        if (bigValue < 0) {
            return [
                FateTag.NEG_BIG_INT,
                ...RLPInt.encode(absVal - 64n)
            ]
        }

        // large positive integer
        return [
            FateTag.POS_BIG_INT,
            ...RLPInt.encode(absVal - 64n)
        ]
    }

    deserializeStream(stream) {
        const data = new Uint8Array(stream)
        const prefix = data[0]

        // small int
        if ((prefix & SMALL_INT_MASK) === 0) {
            // positive
            if ((prefix & 0b10000000) === 0) {
                return [
                    new FateInt(prefix >> 1),
                    data.slice(1)
                ]
            }

            // negative
            const i = (prefix & 0b01111110) >> 1

            return [
                new FateInt(-i),
                data.slice(1)
            ]
        }

        if (prefix === FateTag.POS_BIG_INT || prefix === FateTag.NEG_BIG_INT) {
            const sign = prefix === FateTag.POS_BIG_INT ? 1n : -1n
            const [i, remainder] = RLPInt.decode(data.slice(1))

            return [
                new FateInt((i + 64n) * sign),
                new Uint8Array(remainder)
            ]
        }

        throw new FatePrefixError(prefix)
    }
}

module.exports = IntSerializer

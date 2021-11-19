const RLP = require('rlp')
const FateTag = require('../FateTag')
const RLPInt = require('../utils/RLPInt')
const FateInt = require('../types/FateInt')
const {ByteArray2Int} = require('../utils/Int2ByteArray')

const abs = (val) => val > 0 ? val : val * -1n

const SMALL_INT_MASK = 0b00000001

class IntSerializer {
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
                ...RLPInt(absVal - 64n)
            ]
        }

        // large positive integer
        return [
            FateTag.POS_BIG_INT,
            ...RLPInt(absVal - 64n)
        ]
    }
    deserialize(data) {
        const [value, rest] = this.deserializeStream(data)

        return value
    }
    deserializeStream(data) {
        data = new Uint8Array(data)
        const prefix = data[0]

        //small int
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
            const decoded = RLP.decode(data.slice(1), true)
            const i = ByteArray2Int(decoded.data)

            return [
                new FateInt((i + 64n) * sign),
                new Uint8Array(decoded.remainder)
            ]
        }

        throw new Error('Unsupported byte sequence for ' + prefix.toString(2))
    }
}

module.exports = IntSerializer

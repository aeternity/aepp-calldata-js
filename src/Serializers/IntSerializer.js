const RLP = require('rlp')
const FateTag = require('../FateTag.js')
const RLPInt = require('../utils/RLPInt.js')
const FateInt = require('../types/FateInt.js')
const {ByteArray2Int} = require('../utils/Int2ByteArray.js')

const abs = (val) => val > 0 ? val : val * -1n

const SMALL_INT_MASK = 0b00000001

IntSerializer = function () {}

IntSerializer.prototype = {
    serialize: function (data) {
        const bigValue = (data instanceof FateInt) ? data.value : BigInt(data)
        const absVal = abs(bigValue)

        // small integer
        if (absVal < 64) {
            const small = Number(absVal)
            if (bigValue >= 0) {
                return [(small << 1)]
            }

            // negative
            return [(0xff | (small << 1)) & 0b11111110]
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
    },
    deserialize: function (data) {
        data = new Uint8Array(data)
        const prefix = data[0]

        //small int
        if ((prefix & SMALL_INT_MASK) === 0) {
            // positive
            if ((prefix & 0b10000000) === 0) {
                return new FateInt(prefix >> 1)
            }

            // negative
            const i = (prefix & 0b01111110) >> 1
            return new FateInt(-i)
        }

        if (prefix === FateTag.POS_BIG_INT || prefix === FateTag.NEG_BIG_INT) {
            const sign = prefix === FateTag.POS_BIG_INT ? 1n : -1n
            const i = ByteArray2Int(RLP.decode(data.slice(1)))

            return new FateInt((i + 64n) * sign)

        }

        throw new Error('Unsupported byte sequence for ' + prefix.toString(2))
    }
}

module.exports = IntSerializer

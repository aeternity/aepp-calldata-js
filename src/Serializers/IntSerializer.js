const FateTag = require('../FateTag.js')
const RLPInt = require('../utils/RLPInt.js')
const FateInt = require('../types/FateInt.js')

const abs = (val) => val > 0 ? val : val * -1n

IntSerializer = function () {}

IntSerializer.prototype = {
    serialize: function (value) {
        const bigValue = (value instanceof FateInt) ? value.value : BigInt(value)
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
    }
}

module.exports = IntSerializer

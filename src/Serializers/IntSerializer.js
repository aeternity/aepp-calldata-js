const FATE = require('../fate.js')
const RLPInt = require('../utils/RLPInt.js')

IntSerializer = function () {}

IntSerializer.prototype = {
    serialize: function (value) {
        const absVal = Math.abs(value)

        // small integer
        if (absVal < 64) {
            if (value >= 0) {
                return [(value << 1)]
            }

            // negative
            return [(0xff | (absVal << 1)) & 0b11111110]
        }

        // large negative integer
        if (value < 0) {
            return [
                FATE.NEG_BIG_INT,
                ...RLPInt(absVal - 64)
            ]
        }

        // large positive integer
        return [
            FATE.POS_BIG_INT,
            ...RLPInt(absVal - 64)
        ]
    }
}

module.exports = IntSerializer

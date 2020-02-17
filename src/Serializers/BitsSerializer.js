const FateTag = require('../FateTag.js')
const RLPInt = require('../utils/RLPInt.js')

BitsSerializer = function () {}

BitsSerializer.prototype = {
    serialize: function (value) {
        const absVal = Math.abs(value)
        const prefix = value >= 0 ? FateTag.POS_BITS : FateTag.NEG_BITS

        return [
            prefix,
            ...RLPInt(absVal)
        ]
    }
}

module.exports = BitsSerializer

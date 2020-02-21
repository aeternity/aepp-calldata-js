const FateTag = require('../FateTag.js')
const RLPInt = require('../utils/RLPInt.js')
const FateBits = require('../types/FateBits.js')

const abs = (val) => val > 0 ? val : val * -1n

BitsSerializer = function () {}

BitsSerializer.prototype = {
    serialize: function (data) {
        const value = (data instanceof FateBits) ? data.value : BigInt(data)
        const prefix = value >= 0 ? FateTag.POS_BITS : FateTag.NEG_BITS

        return [
            prefix,
            ...RLPInt(abs(value))
        ]
    }
}

module.exports = BitsSerializer

const FateTag = require('../FateTag')
const RLPInt = require('../utils/RLPInt')
const FateBits = require('../types/FateBits')
const BaseSerializer = require('./BaseSerializer')
const abs = require('../utils/abs')

class BitsSerializer extends BaseSerializer {
    serialize(data) {
        const prefix = data.value >= 0 ? FateTag.POS_BITS : FateTag.NEG_BITS

        return [
            prefix,
            ...RLPInt.encode(abs(data.value))
        ]
    }

    deserializeStream(data) {
        const buffer = new Uint8Array(data)
        const sign = buffer[0] === FateTag.POS_BITS ? 1n : -1n
        const [i, remainder] = RLPInt.decode(buffer.slice(1))

        return [
            new FateBits(i * sign),
            new Uint8Array(remainder)
        ]
    }
}

module.exports = BitsSerializer

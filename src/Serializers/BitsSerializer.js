const RLP = require('rlp')
const FateTag = require('../FateTag')
const RLPInt = require('../utils/RLPInt')
const FateBits = require('../types/FateBits')
const BaseSerializer = require('./BaseSerializer')
const {ByteArray2Int} = require('../utils/Int2ByteArray')
const abs = require('../utils/abs')

class BitsSerializer extends BaseSerializer {
    serialize(data) {
        const prefix = data.value >= 0 ? FateTag.POS_BITS : FateTag.NEG_BITS

        return [
            prefix,
            ...RLPInt(abs(data.value))
        ]
    }

    deserializeStream(data) {
        const buffer = new Uint8Array(data)
        const sign = buffer[0] === FateTag.POS_BITS ? 1n : -1n
        const decoded = RLP.decode(buffer.slice(1), true)
        const i = ByteArray2Int(decoded.data)

        return [
            new FateBits(i * sign),
            new Uint8Array(decoded.remainder)
        ]
    }
}

module.exports = BitsSerializer

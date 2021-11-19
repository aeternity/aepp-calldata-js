const RLP = require('rlp')
const FateTag = require('../FateTag')
const RLPInt = require('../utils/RLPInt')
const FateBits = require('../types/FateBits')
const {ByteArray2Int} = require('../utils/Int2ByteArray')

const abs = (val) => val > 0 ? val : val * -1n

class BitsSerializer {
    serialize(data) {
        const prefix = data.value >= 0 ? FateTag.POS_BITS : FateTag.NEG_BITS

        return [
            prefix,
            ...RLPInt(abs(data.value))
        ]
    }
    deserialize(data) {
        const [value, rest] = this.deserializeStream(data)

        return value
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

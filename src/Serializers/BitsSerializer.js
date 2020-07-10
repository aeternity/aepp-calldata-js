const RLP = require('rlp')
const FateTag = require('../FateTag.js')
const RLPInt = require('../utils/RLPInt.js')
const FateBits = require('../types/FateBits.js')
const {ByteArray2Int} = require('../utils/Int2ByteArray.js')

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
        const buffer = new Uint8Array(data)
        const sign = data[0] === FateTag.POS_BITS ? 1n : -1n
        const i = ByteArray2Int(RLP.decode(buffer.slice(1)))

        return new FateBits(i * sign)
    }
}

module.exports = BitsSerializer

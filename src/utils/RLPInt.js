const RLP = require('rlp')
const {int2ByteArray, byteArray2Int } = require('./int2ByteArray')

module.exports = {
    encode(value) {
        return new Uint8Array(RLP.encode(int2ByteArray(value)))
    },
    decode(buffer) {
        const decoded = RLP.decode(buffer, true)
        return [byteArray2Int(decoded.data), decoded.remainder]
    }
}

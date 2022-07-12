const RLP = require('rlp')
const {Int2ByteArray, ByteArray2Int } = require('./Int2ByteArray')

module.exports = {
    encode(value) {
        return new Uint8Array(RLP.encode(Int2ByteArray(value)))
    },
    decode(buffer) {
        const decoded = RLP.decode(buffer, true)
        return [ByteArray2Int(decoded.data), decoded.remainder]
    }
}

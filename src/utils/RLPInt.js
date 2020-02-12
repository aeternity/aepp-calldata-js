const RLP = require('rlp')
const Int2ByteArray = require('./Int2ByteArray.js')

module.exports = function RLPInt(value) {
    return new Uint8Array(RLP.encode(Int2ByteArray(value)))
}

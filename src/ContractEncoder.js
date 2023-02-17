const RLP = require('rlp')
const ApiEncoder = require('./ApiEncoder')
const Serializer = require('./Serializer')
const BytecodeSerializer = require('./Serializers/BytecodeSerializer')
const {ByteArray2Int, ByteArray2Hex} = require('./utils/Int2ByteArray')

class ContractEncoder {
    constructor() {
        this._apiEncoder = new ApiEncoder()
        this._bytecodeSerializer = new BytecodeSerializer(new Serializer())
    }

    /**
     * Decodes serialized contract metadata and bytecode
     *
     * @param {string} data - Contract bytearray data in a canonical format.
     * @returns {Object} Decoded contract metadata as POJO.
    */
    decode(data) {
        const binData = this._apiEncoder.decodeWithType(data, 'contract_bytearray')
        const decoded = RLP.decode(binData, true)
        const stringDecoder = new TextDecoder()

        return {
            tag: ByteArray2Int(decoded.data[0]),
            vsn: ByteArray2Int(decoded.data[1]),
            sourceHash: ByteArray2Hex(decoded.data[2]),
            aevmTypeInfo: decoded.data[3],
            compilerVersion: stringDecoder.decode(decoded.data[5]),
            payable: Boolean(decoded.data[6][0]),
            bytecode: this._bytecodeSerializer.deserialize(new Uint8Array(decoded.data[4]))
        }
    }
}

module.exports = ContractEncoder

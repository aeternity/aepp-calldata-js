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

    decode(data) {
        const binData = this._apiEncoder.decodeWithType(data, 'contract_bytearray')
        const decoded = RLP.decode(binData, true)
        const stringDecoder = new TextDecoder()

        return {
            tag: ByteArray2Int(decoded.data[0]),
            vsn: ByteArray2Int(decoded.data[1]),
            source_hash: ByteArray2Hex(decoded.data[2]),
            aevm_type_info: decoded.data[3],
            compiler_version: stringDecoder.decode(decoded.data[5]),
            payable: Boolean(decoded.data[6][0]),
            bytecode: this._bytecodeSerializer.deserialize(new Uint8Array(decoded.data[4]))
        }
    }
}

module.exports = ContractEncoder

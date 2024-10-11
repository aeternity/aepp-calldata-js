const RLP = require('rlp')
const FateTag = require('../FateTag')
const BaseSerializer = require('./BaseSerializer')
const BytecodeSerializer = require('./BytecodeSerializer')
const IntSerializer = require('./IntSerializer')
const {byteArray2Int, byteArray2Hex, int2ByteArray} = require('../utils/int2ByteArray')
const hexStringToByteArray = require('../utils/hexStringToByteArray')

class ContractBytecodeSerializer extends BaseSerializer {
    constructor(globalSerializer) {
        super()
        this._bytecodeSerializer = new BytecodeSerializer(globalSerializer)
        this._intSerializer = new IntSerializer()
    }

    serialize(data) {
        const stringEncoder = new TextEncoder()
        const byteArray = RLP.encode([
            data.tag,
            data.vsn,
            hexStringToByteArray(data.sourceHash),
            data.aevmTypeInfo,
            this._bytecodeSerializer.serialize(data.bytecode),
            stringEncoder.encode(data.compilerVersion),
            int2ByteArray(data.payable),
        ])
        return new Uint8Array([
            FateTag.CONTRACT_BYTEARRAY,
            ...this._intSerializer.serialize(byteArray.length),
            ...byteArray,
        ])
    }

    deserializeStream(data) {
        const buffer = new Uint8Array(data)
        const [fateInt, remainder] = this._intSerializer.deserializeStream(buffer.slice(1))
        const overallSize = Number(fateInt)
        const decoded = RLP.decode(remainder.slice(0, overallSize))
        const stringEncoder = new TextDecoder()
        return [
            {
                tag: byteArray2Int(decoded[0]),
                vsn: byteArray2Int(decoded[1]),
                sourceHash: byteArray2Hex(decoded[2]),
                aevmTypeInfo: decoded[3],
                bytecode: this._bytecodeSerializer.deserialize(decoded[4]),
                compilerVersion: stringEncoder.decode(decoded[5]),
                payable: Boolean(decoded[6][0]),
            },
            remainder.slice(overallSize),
        ]
    }
}

module.exports = ContractBytecodeSerializer

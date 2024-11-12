import RLP from 'rlp'
import BaseSerializer from './BaseSerializer.js'
import BytecodeSerializer from './BytecodeSerializer.js'
import IntSerializer from './IntSerializer.js'
import {byteArray2Int, byteArray2Hex} from '../utils/int2ByteArray.js'

class ContractBytecodeSerializer extends BaseSerializer {
    constructor(globalSerializer) {
        super()
        this._bytecodeSerializer = new BytecodeSerializer(globalSerializer)
        this._intSerializer = new IntSerializer()
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

export default ContractBytecodeSerializer

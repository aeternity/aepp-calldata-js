import {asU8, rlpDecodeStream} from '../utils/stream.js'
import RLP from 'rlp'
import FateTag from '../FateTag.js'
import BaseSerializer from './BaseSerializer.js'
import FateOracleAddress from '../types/FateOracleAddress.js'

class OracleSerializer extends BaseSerializer {
    serialize(data) {
        return [
            FateTag.OBJECT,
            FateTag.OTYPE_ORACLE,
            ...RLP.encode(data.value)
        ]
    }

    deserializeStream(data) {
        const buffer = asU8(data)
        const decoded = rlpDecodeStream(buffer.subarray(2))

        return [
            new FateOracleAddress(decoded.data),
            decoded.remainder
        ]
    }
}

export default OracleSerializer

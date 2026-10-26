import {asU8, rlpDecodeStream} from '../utils/stream.js'
import RLP from 'rlp'
import FateTag from '../FateTag.js'
import BaseSerializer from './BaseSerializer.js'
import FateOracleQueryAddress from '../types/FateOracleQueryAddress.js'

class OracleQuerySerializer extends BaseSerializer {
    serialize(data) {
        return [
            FateTag.OBJECT,
            FateTag.OTYPE_ORACLE_QUERY,
            ...RLP.encode(data.value)
        ]
    }

    deserializeStream(data) {
        const buffer = asU8(data)
        const decoded = rlpDecodeStream(buffer.subarray(2))

        return [
            new FateOracleQueryAddress(decoded.data),
            decoded.remainder
        ]
    }
}

export default OracleQuerySerializer

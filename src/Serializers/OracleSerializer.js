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
        const buffer = new Uint8Array(data)
        const decoded = RLP.decode(buffer.slice(2), true)

        return [
            new FateOracleAddress(decoded.data),
            new Uint8Array(decoded.remainder)
        ]
    }
}

export default OracleSerializer

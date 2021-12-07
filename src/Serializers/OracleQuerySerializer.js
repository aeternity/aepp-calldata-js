const RLP = require('rlp')
const FateTag = require('../FateTag')
const BaseSerializer = require('./BaseSerializer')
const FateOracleQueryAddress = require('../types/FateOracleQueryAddress')

class OracleQuerySerializer extends BaseSerializer {
    serialize(data) {
        return [
            FateTag.OBJECT,
            FateTag.OTYPE_ORACLE_QUERY,
            ...RLP.encode(data.value)
        ]
    }

    deserializeStream(data) {
        const buffer = new Uint8Array(data)
        const decoded = RLP.decode(buffer.slice(2), true)

        return [
            new FateOracleQueryAddress(decoded.data),
            new Uint8Array(decoded.remainder)
        ]
    }
}

module.exports = OracleQuerySerializer

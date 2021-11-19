const RLP = require('rlp')
const FateTag = require('../FateTag')
const FateOracleQueryAddress = require('../types/FateOracleQueryAddress')

class OracleQuerySerializer {
    serialize(data) {
        return [
            FateTag.OBJECT,
            FateTag.OTYPE_ORACLE_QUERY,
            ...RLP.encode(data.value)
        ]
    }
    deserialize(data) {
        const [value, rest] = this.deserializeStream(data)

        return value
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

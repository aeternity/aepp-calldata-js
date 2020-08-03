const RLP = require('rlp')
const FateTag = require('../FateTag.js')
const FateOracleQueryAddress = require('../types/FateOracleQueryAddress.js')

class OracleQuerySerializer {
    serialize(data) {
        return [
            FateTag.OBJECT,
            FateTag.OTYPE_ORACLE_QUERY,
            ...RLP.encode(data.value)
        ]
    }
    deserialize(data) {
        const buffer = new Uint8Array(data)
        const value = RLP.decode(buffer.slice(2))

        return new FateOracleQueryAddress(value)
    }
}

module.exports = OracleQuerySerializer

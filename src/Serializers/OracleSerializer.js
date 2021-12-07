const RLP = require('rlp')
const FateTag = require('../FateTag')
const BaseSerializer = require('./BaseSerializer')
const FateOracleAddress = require('../types/FateOracleAddress')

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

module.exports = OracleSerializer

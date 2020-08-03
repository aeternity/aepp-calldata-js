const RLP = require('rlp')
const FateTag = require('../FateTag.js')
const FateOracleAddress = require('../types/FateOracleAddress.js')

class OracleSerializer {
    serialize(data) {
        return [
            FateTag.OBJECT,
            FateTag.OTYPE_ORACLE,
            ...RLP.encode(data.value)
        ]
    }
    deserialize(data) {
        const buffer = new Uint8Array(data)
        const value = RLP.decode(buffer.slice(2))

        return new FateOracleAddress(value)
    }
}

module.exports = OracleSerializer

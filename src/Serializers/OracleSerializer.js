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
        const [value, rest] = this.deserializeStream(data)

        return value
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

const RLP = require('rlp')
const FateTag = require('../FateTag')
const FateOracleAddressRaw = require('../types/FateOracleAddressRaw')

class OracleSerializer {
    serialize(data) {
        return [
            FateTag.OBJECT,
            FateTag.OTYPE_ORACLE,
            ...RLP.encode(data.value)
        ]
    }

    deserialize(data) {
        const [value, _rest] = this.deserializeStream(data)

        return value
    }

    deserializeStream(data) {
        const buffer = new Uint8Array(data)
        const decoded = RLP.decode(buffer.slice(2), true)

        return [
            new FateOracleAddressRaw(decoded.data),
            new Uint8Array(decoded.remainder)
        ]
    }
}

module.exports = OracleSerializer

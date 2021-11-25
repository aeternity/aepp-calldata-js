const RLP = require('rlp')
const FateTag = require('../FateTag')
const BaseSerializer = require('./BaseSerializer')
const FateContractAddressRaw = require('../types/FateContractAddressRaw')

class ContractSerializer extends BaseSerializer {
    serialize(data) {
        return [
            FateTag.OBJECT,
            FateTag.OTYPE_CONTRACT,
            ...RLP.encode(data.value)
        ]
    }

    deserializeStream(data) {
        const buffer = new Uint8Array(data)
        const decoded = RLP.decode(buffer.slice(2), true)

        return [
            new FateContractAddressRaw(decoded.data),
            new Uint8Array(decoded.remainder)
        ]
    }
}

module.exports = ContractSerializer

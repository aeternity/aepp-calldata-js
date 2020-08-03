const RLP = require('rlp')
const FateTag = require('../FateTag.js')
const FateContractAddress = require('../types/FateContractAddress.js')

class ContractSerializer {
    serialize(data) {
        return [
            FateTag.OBJECT,
            FateTag.OTYPE_CONTRACT,
            ...RLP.encode(data.value)
        ]
    }
    deserialize(data) {
        const buffer = new Uint8Array(data)
        const value = RLP.decode(buffer.slice(2))

        return new FateContractAddress(value)
    }
}

module.exports = ContractSerializer

const RLP = require('rlp')
const FateTag = require('../FateTag.js')
const FateAccountAddress = require('../types/FateAccountAddress.js')

class AddressSerializer {
    serialize(data) {
        return [
            FateTag.OBJECT,
            FateTag.OTYPE_ADDRESS,
            ...RLP.encode(data.valueOf())
        ]
    }
    deserialize(data) {
        const buffer = new Uint8Array(data)
        const value = RLP.decode(buffer.slice(2))

        return new FateAccountAddress(value)
    }
}

module.exports = AddressSerializer

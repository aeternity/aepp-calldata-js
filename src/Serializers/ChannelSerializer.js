const RLP = require('rlp')
const FateTag = require('../FateTag.js')
const FateChannelAddress = require('../types/FateChannelAddress.js')

class ChannelSerializer {
    serialize(data) {
        return [
            FateTag.OBJECT,
            FateTag.OTYPE_CHANNEL,
            ...RLP.encode(data.value)
        ]
    }
    deserialize(data) {
        const buffer = new Uint8Array(data)
        const value = RLP.decode(buffer.slice(2))

        return new FateChannelAddress(value)
    }
}

module.exports = ChannelSerializer

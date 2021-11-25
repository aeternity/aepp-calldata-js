const RLP = require('rlp')
const FateTag = require('../FateTag')
const BaseSerializer = require('./BaseSerializer')
const FateChannelAddressRaw = require('../types/FateChannelAddressRaw')

class ChannelSerializer extends BaseSerializer {
    serialize(data) {
        return [
            FateTag.OBJECT,
            FateTag.OTYPE_CHANNEL,
            ...RLP.encode(data.value)
        ]
    }

    deserializeStream(data) {
        const buffer = new Uint8Array(data)
        const decoded = RLP.decode(buffer.slice(2), true)

        return [
            new FateChannelAddressRaw(decoded.data),
            new Uint8Array(decoded.remainder)
        ]
    }
}

module.exports = ChannelSerializer

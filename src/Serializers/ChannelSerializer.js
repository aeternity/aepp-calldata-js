const FateTag = require('../FateTag.js')
const RLP = require('rlp')

ChannelSerializer = function () {}

ChannelSerializer.prototype = {
    serialize: function (data) {
        return [
            FateTag.OBJECT,
            FateTag.OTYPE_CHANNEL,
            ...RLP.encode(data.valueOf())
        ]
    }
}

module.exports = ChannelSerializer

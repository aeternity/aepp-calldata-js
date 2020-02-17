const FateTag = require('../FateTag.js')
const RLPInt = require('../utils/RLPInt.js')

ChannelSerializer = function () {}

ChannelSerializer.prototype = {
    serialize: function (value) {
        return [
            FateTag.OBJECT,
            FateTag.OTYPE_CHANNEL,
            ...RLPInt(value)
        ]
    }
}

module.exports = ChannelSerializer

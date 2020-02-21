const FateTag = require('../FateTag.js')
const RLPInt = require('../utils/RLPInt.js')

ChannelSerializer = function () {}

ChannelSerializer.prototype = {
    serialize: function (data) {
        return [
            FateTag.OBJECT,
            FateTag.OTYPE_CHANNEL,
            ...RLPInt(data.value)
        ]
    }
}

module.exports = ChannelSerializer

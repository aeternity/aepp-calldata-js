const FATE = require('../fate.js')
const RLPInt = require('../utils/RLPInt.js')

ChannelSerializer = function () {}

ChannelSerializer.prototype = {
    serialize: function (value) {
        return [
            FATE.OBJECT,
            FATE.OTYPE_CHANNEL,
            ...RLPInt(value)
        ]
    }
}

module.exports = ChannelSerializer

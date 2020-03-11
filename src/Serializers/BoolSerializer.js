const FateTag = require('../FateTag.js')
const FateBool = require('../types/FateBool.js')

BoolSerializer = function () {}

BoolSerializer.prototype = {
    serialize: function (data) {
        return (data.valueOf() === true) ? [FateTag.TRUE] : [FateTag.FALSE]
    },
    deserialize: function (data) {
        return (data[0] === FateTag.TRUE) ? new FateBool(true) : new FateBool(false)
    }
}

module.exports = BoolSerializer

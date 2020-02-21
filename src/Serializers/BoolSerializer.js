const FateTag = require('../FateTag.js')

BoolSerializer = function () {}

BoolSerializer.prototype = {
    serialize: function (data) {
        return (data.valueOf() === true) ? [FateTag.TRUE] : [FateTag.FALSE]
    }
}

module.exports = BoolSerializer

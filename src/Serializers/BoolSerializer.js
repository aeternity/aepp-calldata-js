const FateTag = require('../FateTag.js')

BoolSerializer = function () {}

BoolSerializer.prototype = {
    serialize: function (value) {
        return (value === true) ? [FateTag.TRUE] : [FateTag.FALSE]
    }
}

module.exports = BoolSerializer

const FATE = require('../fate.js')

BoolSerializer = function () {}

BoolSerializer.prototype = {
    serialize: function (value) {
        return (value === true) ? [FATE.TRUE] : [FATE.FALSE]
    }
}

module.exports = BoolSerializer

const FateTag = require('../FateTag.js')
const RLPInt = require('../utils/RLPInt.js')

OracleSerializer = function () {}

OracleSerializer.prototype = {
    serialize: function (value) {
        return [
            FateTag.OBJECT,
            FateTag.OTYPE_ORACLE,
            ...RLPInt(value)
        ]
    }
}

module.exports = OracleSerializer

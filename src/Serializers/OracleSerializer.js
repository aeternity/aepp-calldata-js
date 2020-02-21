const FateTag = require('../FateTag.js')
const RLPInt = require('../utils/RLPInt.js')

OracleSerializer = function () {}

OracleSerializer.prototype = {
    serialize: function (data) {
        return [
            FateTag.OBJECT,
            FateTag.OTYPE_ORACLE,
            ...RLPInt(data.value)
        ]
    }
}

module.exports = OracleSerializer

const FateTag = require('../FateTag.js')
const RLPInt = require('../utils/RLPInt.js')

OracleQuerySerializer = function () {}

OracleQuerySerializer.prototype = {
    serialize: function (value) {
        return [
            FateTag.OBJECT,
            FateTag.OTYPE_ORACLE_QUERY,
            ...RLPInt(value)
        ]
    }
}

module.exports = OracleQuerySerializer

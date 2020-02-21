const FateTag = require('../FateTag.js')
const RLPInt = require('../utils/RLPInt.js')

OracleQuerySerializer = function () {}

OracleQuerySerializer.prototype = {
    serialize: function (data) {
        return [
            FateTag.OBJECT,
            FateTag.OTYPE_ORACLE_QUERY,
            ...RLPInt(data.value)
        ]
    }
}

module.exports = OracleQuerySerializer

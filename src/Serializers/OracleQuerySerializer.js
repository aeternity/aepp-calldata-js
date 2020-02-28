const FateTag = require('../FateTag.js')
const RLP = require('rlp')

OracleQuerySerializer = function () {}

OracleQuerySerializer.prototype = {
    serialize: function (data) {
        return [
            FateTag.OBJECT,
            FateTag.OTYPE_ORACLE_QUERY,
            ...RLP.encode(data.valueOf())
        ]
    }
}

module.exports = OracleQuerySerializer

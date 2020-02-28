const FateTag = require('../FateTag.js')
const RLP = require('rlp')

OracleSerializer = function () {}

OracleSerializer.prototype = {
    serialize: function (data) {
        return [
            FateTag.OBJECT,
            FateTag.OTYPE_ORACLE,
            ...RLP.encode(data.valueOf())
        ]
    }
}

module.exports = OracleSerializer

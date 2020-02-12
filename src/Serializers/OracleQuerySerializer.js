const FATE = require('../fate.js')
const RLPInt = require('../utils/RLPInt.js')

OracleQuerySerializer = function () {}

OracleQuerySerializer.prototype = {
    serialize: function (value) {
        return [
            FATE.OBJECT,
            FATE.OTYPE_ORACLE_QUERY,
            ...RLPInt(value)
        ]
    }
}

module.exports = OracleQuerySerializer

const FATE = require('../fate.js')
const RLPInt = require('../utils/RLPInt.js')

OracleSerializer = function () {}

OracleSerializer.prototype = {
    serialize: function (value) {
        return [
            FATE.OBJECT,
            FATE.OTYPE_ORACLE,
            ...RLPInt(value)
        ]
    }
}

module.exports = OracleSerializer

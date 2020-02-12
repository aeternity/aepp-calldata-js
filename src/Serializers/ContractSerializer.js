const FATE = require('../fate.js')
const RLPInt = require('../utils/RLPInt.js')

ContractSerializer = function () {}

ContractSerializer.prototype = {
    serialize: function (value) {
        return [
            FATE.OBJECT,
            FATE.OTYPE_CONTRACT,
            ...RLPInt(value)
        ]
    }
}

module.exports = ContractSerializer

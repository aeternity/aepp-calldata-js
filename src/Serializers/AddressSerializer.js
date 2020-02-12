const FATE = require('../fate.js')
const RLPInt = require('../utils/RLPInt.js')

AddressSerializer = function () {}

AddressSerializer.prototype = {
    serialize: function (value) {
        return [
            FATE.OBJECT,
            FATE.OTYPE_ADDRESS,
            ...RLPInt(value)
        ]
    }
}

module.exports = AddressSerializer

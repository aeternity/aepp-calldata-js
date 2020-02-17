const FateTag = require('../FateTag.js')
const RLPInt = require('../utils/RLPInt.js')

AddressSerializer = function () {}

AddressSerializer.prototype = {
    serialize: function (value) {
        return [
            FateTag.OBJECT,
            FateTag.OTYPE_ADDRESS,
            ...RLPInt(value)
        ]
    }
}

module.exports = AddressSerializer

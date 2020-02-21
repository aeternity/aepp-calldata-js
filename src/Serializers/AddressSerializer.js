const FateTag = require('../FateTag.js')
const RLPInt = require('../utils/RLPInt.js')

AddressSerializer = function () {}

AddressSerializer.prototype = {
    serialize: function (data) {
        return [
            FateTag.OBJECT,
            FateTag.OTYPE_ADDRESS,
            ...RLPInt(data.value)
        ]
    }
}

module.exports = AddressSerializer

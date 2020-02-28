const FateTag = require('../FateTag.js')
const RLP = require('rlp')

AddressSerializer = function () {}

AddressSerializer.prototype = {
    serialize: function (data) {
        return [
            FateTag.OBJECT,
            FateTag.OTYPE_ADDRESS,
            ...RLP.encode(data.valueOf())
        ]
    }
}

module.exports = AddressSerializer

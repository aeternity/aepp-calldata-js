const FateTag = require('../FateTag.js')
const RLP = require('rlp')

ContractSerializer = function () {}

ContractSerializer.prototype = {
    serialize: function (data) {
        return [
            FateTag.OBJECT,
            FateTag.OTYPE_CONTRACT,
            ...RLP.encode(data.valueOf())
        ]
    }
}

module.exports = ContractSerializer

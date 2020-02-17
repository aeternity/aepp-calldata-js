const FateTag = require('../FateTag.js')
const RLPInt = require('../utils/RLPInt.js')

ContractSerializer = function () {}

ContractSerializer.prototype = {
    serialize: function (value) {
        return [
            FateTag.OBJECT,
            FateTag.OTYPE_CONTRACT,
            ...RLPInt(value)
        ]
    }
}

module.exports = ContractSerializer

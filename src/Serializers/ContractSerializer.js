const FateTag = require('../FateTag.js')
const RLPInt = require('../utils/RLPInt.js')

ContractSerializer = function () {}

ContractSerializer.prototype = {
    serialize: function (data) {
        return [
            FateTag.OBJECT,
            FateTag.OTYPE_CONTRACT,
            ...RLPInt(data.value)
        ]
    }
}

module.exports = ContractSerializer

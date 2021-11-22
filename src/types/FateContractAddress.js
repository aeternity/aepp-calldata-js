const FateAddress = require('./FateAddress')

class FateContractAddress extends FateAddress {
    constructor(value) {
        super(value, 'contract_address', 'ct')
    }
}

module.exports = FateContractAddress

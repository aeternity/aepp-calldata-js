const FateAddress = require('./FateAddress')

class FateContractAddress extends FateAddress {
    constructor(value) {
        super(value, 'contract_pubkey', 'ct')
    }
}

module.exports = FateContractAddress

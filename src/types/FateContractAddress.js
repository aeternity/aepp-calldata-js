const FateAddress = require('./FateAddress')
const { FateTypeContractAddress } = require('../FateTypes')

class FateContractAddress extends FateAddress {
    constructor(value) {
        super(value, 'contract_pubkey', 'ct')
    }

    get type() {
        return FateTypeContractAddress()
    }
}

module.exports = FateContractAddress

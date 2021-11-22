const FateAddressRaw = require('./FateAddressRaw')

class FateContractAddressRaw extends FateAddressRaw {
    constructor(value) {
        super(value, 'contract_address', 'ct')
    }
}

module.exports = FateContractAddressRaw

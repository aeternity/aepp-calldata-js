const FateAddress = require('./FateAddress.js')

class FateContractAddress extends FateAddress {
  constructor(value) {
    super(value, 32, 'contract_address', 'ct')
  }
}

module.exports = FateContractAddress

const FateBytes = require('./FateBytes.js')

class FateContractAddress extends FateBytes {
  constructor(value) {
    super(value, 32, 'contract_address')
  }

  valueOf() {
    return this.base58Encode('ct')
  }
}

module.exports = FateContractAddress

const FateBytes = require('./FateBytes.js')

class FateAccountAddress extends FateBytes {
  constructor(value) {
    super(value, 32, 'account_address')
  }

  valueOf() {
    return this.base58Encode('ak')
  }
}

module.exports = FateAccountAddress

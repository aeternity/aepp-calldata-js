const FateBytes = require('./FateBytes.js')

class FateAccountAddress extends FateBytes {
  constructor(value) {
    super(value, 32, 'account_address')
  }
}

module.exports = FateAccountAddress

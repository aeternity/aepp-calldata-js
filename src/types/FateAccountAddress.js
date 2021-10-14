const FateAddress = require('./FateAddress.js')

class FateAccountAddress extends FateAddress {
  constructor(value) {
    super(value, 32, 'account_address', 'ak')
  }
}

module.exports = FateAccountAddress

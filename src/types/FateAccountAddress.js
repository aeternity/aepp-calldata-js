const FateAddress = require('./FateAddress')

class FateAccountAddress extends FateAddress {
  constructor(value) {
    super(value, 32, 'account_address', 'ak')
  }
}

module.exports = FateAccountAddress

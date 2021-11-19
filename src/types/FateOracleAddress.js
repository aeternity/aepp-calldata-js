const FateAddress = require('./FateAddress')

class FateOracleAddress extends FateAddress {
  constructor(value) {
    super(value, 32, 'oracle_address', 'ok')
  }
}

module.exports = FateOracleAddress

const FateAddress = require('./FateAddress.js')

class FateOracleQueryAddress extends FateAddress {
  constructor(value) {
    super(value, 32, 'oracle_query_address', 'oq')
  }
}

module.exports = FateOracleQueryAddress

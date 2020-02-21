const FateBytes = require('./FateBytes.js')

class FateOracleQueryAddress extends FateBytes {
  constructor(value) {
    super(value, 32, 'oracle_query_address')
  }
}

module.exports = FateOracleQueryAddress

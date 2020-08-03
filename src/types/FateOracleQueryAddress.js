const FateBytes = require('./FateBytes.js')

class FateOracleQueryAddress extends FateBytes {
  constructor(value) {
    super(value, 32, 'oracle_query_address')
  }

  valueOf() {
    return this.base58Encode('oq')
  }
}

module.exports = FateOracleQueryAddress

const FateBytes = require('./FateBytes.js')

class FateOracleAddress extends FateBytes {
  constructor(value) {
    super(value, 32, 'oracle_address')
  }

  valueOf() {
    return this.base58Encode('ok')
  }
}

module.exports = FateOracleAddress

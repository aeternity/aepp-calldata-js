const FateAddress = require('./FateAddress')

class FateOracleAddress extends FateAddress {
    constructor(value) {
        super(value, 'oracle_pubkey', 'ok')
    }
}

module.exports = FateOracleAddress

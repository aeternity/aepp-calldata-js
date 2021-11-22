const FateAddress = require('./FateAddress')

class FateOracleAddress extends FateAddress {
    constructor(value) {
        super(value, 'oracle_address', 'ok')
    }
}

module.exports = FateOracleAddress

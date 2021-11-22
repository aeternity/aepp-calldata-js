const FateAddress = require('./FateAddress')

class FateOracleQueryAddress extends FateAddress {
    constructor(value) {
        super(value, 'oracle_query_address', 'oq')
    }
}

module.exports = FateOracleQueryAddress

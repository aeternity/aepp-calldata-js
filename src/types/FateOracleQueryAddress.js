const FateAddress = require('./FateAddress')

class FateOracleQueryAddress extends FateAddress {
    constructor(value) {
        super(value, 'oracle_query_id', 'oq')
    }
}

module.exports = FateOracleQueryAddress

const FateAddress = require('./FateAddress')
const { FateTypeOracleQueryAddress } = require('../FateTypes')

class FateOracleQueryAddress extends FateAddress {
    constructor(value) {
        super(value, 'oracle_query_id', 'oq')
    }

    get type() {
        return FateTypeOracleQueryAddress()
    }
}

module.exports = FateOracleQueryAddress

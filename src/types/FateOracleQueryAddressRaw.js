const FateAddressRaw = require('./FateAddressRaw')

class FateOracleQueryAddressRaw extends FateAddressRaw {
    constructor(value) {
        super(value, 'oracle_query_address', 'oq')
    }
}

module.exports = FateOracleQueryAddressRaw

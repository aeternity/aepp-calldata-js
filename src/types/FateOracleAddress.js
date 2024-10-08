const FateAddress = require('./FateAddress')
const { FateTypeOracleAddress } = require('../FateTypes')

class FateOracleAddress extends FateAddress {
    constructor(value) {
        super(value, 'oracle_pubkey', 'ok')
    }

    get type() {
        return FateTypeOracleAddress()
    }
}

module.exports = FateOracleAddress

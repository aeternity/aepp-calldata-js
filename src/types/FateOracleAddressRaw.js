const FateAddressRaw = require('./FateAddressRaw')

class FateOracleAddressRaw extends FateAddressRaw {
    constructor(value) {
        super(value, 'oracle_address', 'ok')
    }
}

module.exports = FateOracleAddressRaw

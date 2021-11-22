const FateAddress = require('./FateAddress')

class FateAccountAddress extends FateAddress {
    constructor(value) {
        super(value, 'account_address', 'ak')
    }
}

module.exports = FateAccountAddress

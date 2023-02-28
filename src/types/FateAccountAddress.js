const FateAddress = require('./FateAddress')

class FateAccountAddress extends FateAddress {
    constructor(value) {
        super(value, 'account_pubkey', 'ak')
    }
}

module.exports = FateAccountAddress

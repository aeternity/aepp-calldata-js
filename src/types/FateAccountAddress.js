const FateAddress = require('./FateAddress')
const { FateTypeAccountAddress } = require('../FateTypes')

class FateAccountAddress extends FateAddress {
    constructor(value) {
        super(value, 'account_pubkey', 'ak')
    }

    get type() {
        return FateTypeAccountAddress()
    }
}

module.exports = FateAccountAddress

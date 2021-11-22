const FateAddressRaw = require('./FateAddressRaw')

class FateAccountAddressRaw extends FateAddressRaw {
    constructor(value) {
        super(value, 'account_address', 'ak')
    }
}

module.exports = FateAccountAddressRaw

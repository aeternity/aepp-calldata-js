const FateAddress = require('./FateAddress')
const { FateTypeChannelAddress } = require('../FateTypes')

class FateChannelAddress extends FateAddress {
    constructor(value) {
        super(value, 'channel', 'ch')
    }

    get type() {
        return FateTypeChannelAddress()
    }
}

module.exports = FateChannelAddress

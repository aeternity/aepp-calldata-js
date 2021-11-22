const FateAddress = require('./FateAddress')

class FateChannelAddress extends FateAddress {
    constructor(value) {
        super(value, 'channel_address', 'ch')
    }
}

module.exports = FateChannelAddress

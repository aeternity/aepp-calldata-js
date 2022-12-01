const FateAddress = require('./FateAddress')

class FateChannelAddress extends FateAddress {
    constructor(value) {
        super(value, 'channel', 'ch')
    }
}

module.exports = FateChannelAddress

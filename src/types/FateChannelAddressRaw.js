const FateAddressRaw = require('./FateAddressRaw')

class FateChannelAddressRaw extends FateAddressRaw {
    constructor(value) {
        super(value, 'channel_address', 'ch')
    }
}

module.exports = FateChannelAddressRaw

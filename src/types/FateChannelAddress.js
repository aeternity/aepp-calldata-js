const FateAddress = require('./FateAddress.js')

class FateChannelAddress extends FateAddress {
  constructor(value) {
    super(value, 32, 'channel_address', 'ch')
  }
}

module.exports = FateChannelAddress

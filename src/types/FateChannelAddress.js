const FateBytes = require('./FateBytes.js')

class FateChannelAddress extends FateBytes {
  constructor(value) {
    super(value, 32, 'channel_address')
  }
}

module.exports = FateChannelAddress

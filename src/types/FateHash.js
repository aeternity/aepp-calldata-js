const FateBytes = require('./FateBytes.js')

class FateHash extends FateBytes {
  constructor(value) {
    super(value, 32, 'hash')
  }
}

module.exports = FateHash

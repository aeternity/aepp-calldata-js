const FateBytes = require('./FateBytes.js')

class FateSignature extends FateBytes {
  constructor(value) {
    super(value, 64, 'signature')
  }
}

module.exports = FateSignature

const FateData = require('./FateData.js')

class FateBits extends FateData {
  constructor(value) {
    super('bits')

    this._value = BigInt(value)
  }

  get value() {
    return this._value
  }

  valueOf() {
    return this._value
  }
}

module.exports = FateBits

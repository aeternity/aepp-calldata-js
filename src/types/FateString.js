const FateData = require('./FateData.js')

class FateString extends FateData {
  constructor(value) {
    super('string')

    this._value = value.toString()
  }

  toString() {
    return this._value
  }
}

module.exports = FateString

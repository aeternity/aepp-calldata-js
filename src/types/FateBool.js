const FateData = require('./FateData.js')

class FateBool extends FateData {
  constructor(value) {
    super('bool')

    this._value = !!value
  }

  get value() {
    return this._value
  }

  valueOf() {
    return this._value
  }
}

module.exports = FateBool

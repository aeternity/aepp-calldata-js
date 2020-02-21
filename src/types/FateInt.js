const FateData = require('./FateData.js')

class FateInt extends FateData {
  constructor(value) {
    super('int')

    this._value = BigInt(value)
  }

  get value() {
    return this._value
  }

  valueOf() {
    return this._value 
  }
}

module.exports = FateInt

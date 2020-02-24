const FateData = require('./FateData.js')
const {FateTypeInt} = require('../FateTypes.js')

class FateInt extends FateData {
  constructor(value) {
    super('int')

    this._value = BigInt(value)
  }

  get value() {
    return this._value
  }

  get type() {
    return FateTypeInt()
  }

  valueOf() {
    return this._value 
  }
}

module.exports = FateInt

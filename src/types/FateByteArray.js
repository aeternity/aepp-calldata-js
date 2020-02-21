const FateData = require('./FateData.js')
const {FateTypeByteArray} = require('../FateTypes.js')

class FateByteArray extends FateData {
  constructor(value = []) {
    super('byte_array')

    this._value = new Uint8Array(value)
  }

  get length() {
    return this._value.length
  }

  get type() {
    return FateTypeByteArray()
  }

  valueOf() {
    return this._value
  }
}

module.exports = FateByteArray

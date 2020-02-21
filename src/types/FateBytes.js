const FateData = require('./FateData.js')

class FateBytes extends FateData {
  constructor(value, size, name = 'bytes') {
    super(name)

    this._value = BigInt(value)
    // not implemented yet
    this._size = size
  }

  get value() {
    return this._value
  }

  get size() {
    return this._size
  }
}

module.exports = FateBytes

const FateData = require('./FateData.js')
const Int2ByteArray = require('../utils/Int2ByteArray.js')
const HexStringToByteArray = require('../utils/HexStringToByteArray.js')

const toByteArray = (value) => {
  if (Array.isArray(value)) {
    return new Uint8Array(value)
  }

  if (typeof value === 'string') {
    return HexStringToByteArray(value)
  }

  return Int2ByteArray(BigInt(value))
}

class FateBytes extends FateData {
  constructor(value, size, name = 'bytes') {
    super(name)

    this._value = toByteArray(value)

    // not implemented yet
    this._size = size
  }

  get value() {
    return this._value
  }

  get size() {
    return this._size
  }

  valueOf() {
    return this._value
  }
}

module.exports = FateBytes

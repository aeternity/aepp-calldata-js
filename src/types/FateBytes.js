const FateData = require('./FateData')
const {Int2ByteArray} = require('../utils/Int2ByteArray')
const HexStringToByteArray = require('../utils/HexStringToByteArray')
const bs58check = require('bs58check')

const toByteArray = (value) => {
  if (Array.isArray(value) || ArrayBuffer.isView(value)) {
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

  base58Encode(prefix) {
    return prefix + '_' + bs58check.encode(this.value)
  }

  valueOf() {
    return this._value
  }
}

module.exports = FateBytes

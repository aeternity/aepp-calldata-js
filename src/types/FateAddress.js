const FateBytes = require('./FateBytes')
const bs58check = require('bs58check')

const base58Decode = (prefix, value) => {
  if (typeof value === 'string' && value.charAt(2) === '_') {
    if (!value.startsWith(prefix)) {
      throw new Error('Invalid prefix: ' + value.substring(0, 2))
    }

    return bs58check.decode(value.substring(prefix.length + 1))
  }

  return value
}

class FateAddress extends FateBytes {
  constructor(value, size, name, prefix) {
    //eventually decode the value
    value = base58Decode(prefix, value)
    super(value, size, name)

    this._prefix = prefix
  }

  get prefix() {
    return this._prefix
  }

  valueOf() {
    return this.base58Encode()
  }

  base58Encode() {
    return this.prefix + '_' + bs58check.encode(this.value)
  }
}

module.exports = FateAddress

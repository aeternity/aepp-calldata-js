const FateBytes = require('./FateBytes')
const bs58check = require('bs58check')

class FateAddressRaw extends FateBytes {
    constructor(value, name, prefix) {
        super(value, 32, name)

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

module.exports = FateAddressRaw

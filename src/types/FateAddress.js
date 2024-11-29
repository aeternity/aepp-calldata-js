import FateBytes from './FateBytes.js'

class FateAddress extends FateBytes {
    constructor(value, name, prefix) {
        super(value, 32, name)

        this._prefix = prefix
    }

    get prefix() {
        return this._prefix
    }

    accept(visitor) {
        return visitor.visitAddress(this)
    }
}

export default FateAddress

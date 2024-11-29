import FateBytes from './FateBytes.js'

class FateHash extends FateBytes {
    constructor(value) {
        super(value, 32, 'hash')
    }
}

export default FateHash

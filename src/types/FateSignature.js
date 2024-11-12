import FateBytes from './FateBytes.js'

class FateSignature extends FateBytes {
    constructor(value) {
        super(value, 64, 'signature')
    }
}

export default FateSignature

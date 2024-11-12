import FateBls12381Field from './FateBls12381Field.js'
import {FateTypeBls12381Fp} from '../FateTypes.js'

const SIZE = 48
const NAME = 'bls12_381.fp'

class FateBls12381Fp extends FateBls12381Field {
    constructor(value) {
        super(value, SIZE, NAME)
    }

    get type() {
        return FateTypeBls12381Fp()
    }

    accept(visitor) {
        return visitor.visitBls12381Fp(this)
    }
}

export default FateBls12381Fp

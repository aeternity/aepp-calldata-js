import FateBls12381Field from './FateBls12381Field.js'
import {FateTypeBls12381Fr} from '../FateTypes.js'

const SIZE = 32
const NAME = 'bls12_381.fr'

class FateBls12381Fr extends FateBls12381Field {
    constructor(value) {
        super(value, SIZE, NAME)
    }

    get type() {
        return FateTypeBls12381Fr()
    }

    accept(visitor) {
        return visitor.visitBls12381Fr(this)
    }
}

export default FateBls12381Fr

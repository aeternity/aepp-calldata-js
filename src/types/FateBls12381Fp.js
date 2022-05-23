const FateBls12381Field = require('./FateBls12381Field')
const {FateTypeBls12381Fp} = require('../FateTypes')

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

module.exports = FateBls12381Fp

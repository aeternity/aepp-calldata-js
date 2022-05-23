const FateBls12381Field = require('./FateBls12381Field')
const {FateTypeBls12381Fr} = require('../FateTypes')

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

module.exports = FateBls12381Fr

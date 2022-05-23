const FateBls12381Fr = require('../types/FateBls12381Fr')
const FateBls12381Fp = require('../types/FateBls12381Fp')
const BaseDataFactory = require('./BaseDataFactory')

const TYPES = [
    'bls12_381.fr',
    'bls12_381.fp',
]

class Bls12381DataFactory extends BaseDataFactory {
    supports({ name, _valueTypes }) {
        return TYPES.includes(name)
    }

    create(type, value) {
        switch (type.name) {
        case 'bls12_381.fr':
            return new FateBls12381Fr(value)
        case 'bls12_381.fp':
            return new FateBls12381Fp(value)
        default:
            throw new Error(`Unsupported type "${type.name}"`)
        }
    }
}

module.exports = Bls12381DataFactory

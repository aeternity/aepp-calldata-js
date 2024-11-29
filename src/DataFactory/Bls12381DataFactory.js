import FateBls12381Fr from '../types/FateBls12381Fr.js'
import FateBls12381Fp from '../types/FateBls12381Fp.js'
import BaseDataFactory from './BaseDataFactory.js'

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

export default Bls12381DataFactory

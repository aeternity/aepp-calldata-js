const BaseSerializer = require('./BaseSerializer')
const BytesSerializer = require('./BytesSerializer')
const FateBls12381Fr = require('../types/FateBls12381Fr')
const FateBls12381Fp = require('../types/FateBls12381Fp')

const bytesSerializer = new BytesSerializer()

const factory = (type, data) => {
    switch (type.name) {
    case 'bls12_381.fr':
        return new FateBls12381Fr(data)
    case 'bls12_381.fp':
        return new FateBls12381Fp(data)
    default:
        throw new Error(`Unsupported type "${type.name}"`)
    }
}

class Bls12381FieldSerializer extends BaseSerializer {
    serialize(bytes) {
        return bytesSerializer.serialize(bytes)
    }

    deserializeStream(data, typeInfo) {
        const [bytes, rest] = bytesSerializer.deserializeStream(data)

        return [
            factory(typeInfo, bytes.valueOf()),
            rest
        ]
    }
}

module.exports = Bls12381FieldSerializer

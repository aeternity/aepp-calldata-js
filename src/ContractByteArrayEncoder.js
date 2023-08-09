const Serializer = require('./Serializer')
const ApiEncoder = require('./ApiEncoder')
const CanonicalMapper = require('./Mapper/CanonicalMapper')
const ExternalDataFactory = require('./ExternalDataFactory')

class ContractByteArrayEncoder {
    constructor() {
        /** @type {Serializer} */
        this._serializer = new Serializer()

        /** @type {ApiEncoder} */
        this._apiEncoder = new ApiEncoder()

        /** @type {ExternalDataFactory} */
        this._externalDataFactory = new ExternalDataFactory()

        /** @type {CanonicalMapper} */
        this._canonicalMapper = new CanonicalMapper()
    }

    /**
     * Encode FATE data to contract bytearray.
     *
     * @example
     * const encoded = encoder.encode(FateTypeString(), "whoolymoly")
     * console.log(`Encoded data: ${encoded}`)
     * // Outputs:
     * // Encoded data: cb_KXdob29seW1vbHlGazSE
     *
     * @param {object} type - Data as Javascript data structures. See README.md
     * @param {Array} data - Data as Javascript data structures. See README.md
     * @returns {string} Encoded contract byte array
    */
    encode(type, value) {
        const data = this._externalDataFactory.create(type, value)
        const serialized = this._serializer.serialize(data)
        const binData = new Uint8Array(serialized.flat(Infinity))

        return this._apiEncoder.encode('contract_bytearray', binData)
    }

    /**
     * Decodes arbitrary contract bytearray data.
     *
     * Note that:
     * - Variants are not annotated with constructor names
     * - Record keys are lost
     * - Any custom type information is lost
     * - STL type information is lost: i.e. Chain, AENS, Set, BLS12_381
     *
     * @example
     * const decoded = encoder.decode('cb_KXdob29seW1vbHlGazSE')
     * console.log(`Decoded data: ${decoded}`)
     * // Outputs:
     * // Decoded data: whoolymoly
     *
     * @param {string} data - Contract bytearray data in a canonical format.
     * @returns {boolean|string|BigInt|Array|Map|Object}
     *  Decoded value as Javascript data structures. See README.md
    */
    decode(data) {
        const binData = this._apiEncoder.decodeWithType(data, 'contract_bytearray')
        const deserialized = this._serializer.deserialize(binData)

        return this._canonicalMapper.toCanonical(deserialized)
    }

    /**
     * Decodes arbitrary contract bytearray data with type information.
     *
     * @example
     * const decoded = encoder.decodeWithType('cb_KXdob29seW1vbHlGazSE', FateTypeString())
     * console.log(`Decoded data: ${decoded}`)
     * // Outputs:
     * // Decoded data: whoolymoly
     *
     * @param {string} data - Contract bytearray data in a canonical format.
     * @param {object} type - Data as Javascript data structures. See README.md
     * @returns {boolean|string|BigInt|Array|Map|Object}
     *  Decoded value as Javascript data structures. See README.md
    */
    decodeWithType(data, type) {
        const binData = this._apiEncoder.decodeWithType(data, 'contract_bytearray')
        const deserialized = this._serializer.deserializeWithType(binData, type)

        return this._canonicalMapper.toCanonical(deserialized)
    }
}

module.exports = ContractByteArrayEncoder

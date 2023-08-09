const InternalEncoder = require('../ContractByteArrayEncoder')

class ContractByteArrayEncoder {
    constructor() {
        this._internalEncoder = new InternalEncoder()
    }

    /**
     * Encode FATE data to contract bytearray.
     *
     * @example
     * const resolver = new TypeResolver()
     * const encoded = encoder.encode("whoolymoly", resolver.resolveType('string'))
     * console.log(`Encoded data: ${encoded}`)
     * // Outputs:
     * // Encoded data: cb_KXdob29seW1vbHlGazSE
     *
     * @param {any} value - Value as Javascript data structures. See README.md
     * @param {object} type - Opaque type information provided by TypeResolver. See README.md
     * @returns {string} Encoded contract byte array
    */
    encodeWithType(value, type) {
        return this._internalEncoder.encode(type, value)
    }

    /**
     * Decodes arbitrary contract bytearray data using only builtin FATE type information
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
        return this._internalEncoder.decode(data)
    }

    /**
     * Decodes arbitrary contract bytearray data with type information.
     *
     * @example
     * const resolver = new TypeResolver()
     * const type = resolver.resolveType('string')
     * const decoded = encoder.decodeWithType('cb_KXdob29seW1vbHlGazSE', type)
     * console.log(`Decoded data: ${decoded}`)
     * // Outputs:
     * // Decoded data: whoolymoly
     *
     * @param {string} data - Contract bytearray data in a canonical format.
     * @param {object} type - Opaque type information provided by TypeResolver. See README.md
     * @returns {boolean|string|BigInt|Array|Map|Object}
     *  Decoded value as Javascript data structures. See README.md
    */
    decodeWithType(data, type) {
        return this._internalEncoder.decodeWithType(data, type)
    }
}

module.exports = ContractByteArrayEncoder

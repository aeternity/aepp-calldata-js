const InternalEncoder = require('../ContractByteArrayEncoder')

class ContractByteArrayEncoder {
    constructor() {
        this._internalEncoder = new InternalEncoder()
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
        return this._internalEncoder.decode(data)
    }
}

module.exports = ContractByteArrayEncoder

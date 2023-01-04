const InternalEncoder = require('../ApiEncoder')

class FateApiEncoder {
    constructor() {
        this._internalEncoder = new InternalEncoder()
    }

    /**
     * Encode data to canonical API format.
     *
     * @example
     * const encoded = encoder.encode('contract_bytearray', new Uint8Array())
     * console.log(`Encoded data: ${encoded}`)
     * // Outputs:
     * // Encoded data: cb_Xfbg4g==
     *
     * @param {string} type - Name of the data type
     * @param {Uint8Array} data - Data to be encoded
     * @returns {string} Encoded data in canonical format
    */
    encode(type, data) {
        return this._internalEncoder.encode(type, data)
    }

    /**
     * Decode API data
     *
     * @example
     * const decoded = encoder.decode('cb_Xfbg4g==')
     * console.log('Decoded data:', Array.from(decoded))
     * // Outputs:
     * // Decoded data: []
     *
     * @param {string} data - FATE API encoded data in canonical format.
     * @returns {Uint8Array} Decoded data
    */
    decode(data) {
        return this._internalEncoder.decode(data)
    }
}

module.exports = FateApiEncoder

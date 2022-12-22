const InternalEncoder = require('../Encoder')

/**
 * @deprecated Use AciContractCallEncoder
 */
class Encoder {
    /**
     * Creates contract encoder
     *
     * @example
     * const ACI = require('./Test.json')
     * const encoder = new Encoder(ACI)
     *
     * @param {Object} aci - The contract ACI in a canonical form as POJO.
    */
    constructor(aci) {
        this._internalEncoder = new InternalEncoder(aci)
    }

    /**
     * Creates contract calldata
     *
     * @example
     * const encoded = encoder.encode('Test', 'test_string', ["whoolymoly"])
     * console.log(`Encoded data: ${encoded}`)
     * // Outputs:
     * // Encoded data: cb_KxHwzCuVGyl3aG9vbHltb2x5zwMSnw==
     *
     * @param {string} contract - The contract name as defined in the ACI.
     * @param {string} funName - The function name as defined in the ACI.
     * @param {Array} args - An array of call arguments as Javascript data structures. See README.md
     * @returns {string} Encoded calldata
    */
    encode(contract, funName, args) {
        return this._internalEncoder.encode(contract, funName, args)
    }

    /**
     * Decodes successful (type = ok) contract call return data
     *
     * @example
     * const decoded = encoder.decode('Test', 'test_string', 'cb_KXdob29seW1vbHlGazSE')
     * console.log(`Decoded data: ${decoded}`)
     * // Outputs:
     * // Decoded data: whoolymoly
     *
     * @param {string} contract - The contract name as defined in the ACI.
     * @param {string} funName - The function name as defined in the ACI.
     * @param {string} data - The call return value in a canonical format.
     * @returns {boolean|string|BigInt|Array|Map|Object}
     *  Decoded value as Javascript data structures. See README.md
    */
    decode(contract, funName, data) {
        return this._internalEncoder.decode(contract, funName, data)
    }

    /**
     * Decodes arbitrary contract bytearray data.
     *
     * Note that:
     * - Record keys are lost
     * - Variant constructor names are lost
     * - Any user type information is lost
     * - STL type information is lost: i.e. Chain, AENS, Set, BLS12_381
     *
     * @example
     * const decoded = encoder.decodeContractByteArray('cb_KXdob29seW1vbHlGazSE')
     * console.log(`Decoded data: ${decoded}`)
     * // Outputs:
     * // Decoded data: whoolymoly
     *
     * @param {string} data - Contract bytearray data in a canonical format.
     * @returns {boolean|string|BigInt|Array|Map|Object}
     *  Decoded value as Javascript data structures. See README.md
    */
    decodeContractByteArray(data) {
        return this._internalEncoder.decodeContractByteArray(data)
    }

    /* eslint-disable max-len */
    /**
     * Decodes a string
     *
     *
     * @example
     * const error = encoder.decodeString('cb_VHlwZSBlcnJvciBvbiBjYWxsOiBbe2J5dGVzLDw8MjQwLDIsLi4uPj59XSBpcyBub3Qgb2YgdHlwZSBbe2J5dGVzLDMyfV3EtJjU')
     * console.log('Error: ' + error.toString())
     * // Outputs:
     * // Error: Type error on call: [{bytes,<<240,2,...>>}] is not of type [{bytes,32}]
     *
     * @param {string} data - The encoded string.
     * @returns {Uint8Array} Decoded value as byte array.
    */
    decodeString(data) {
        return this._internalEncoder.decodeString(data)
    }
    /* eslint-enable max-len */

    /**
     * Decodes a FATE string
     *
     * @example
     * const revert = encoder.decodeFateString('cb_OXJlcXVpcmUgZmFpbGVkarP9mg==')
     * console.log('Revert: ' + revert)
     * // Outputs:
     * // Revert: require failed
     *
     * @param {string} data - The FATE encoded string.
     * @returns {string} Decoded string value.
    */
    decodeFateString(data) {
        return this._internalEncoder.decodeFateString(data)
    }

    /**
     * Decodes contract event
     *
     * @example
     * const data = encoder.decodeEvent('Test', 'cb_dHJpZ2dlcmVk1FYuYA==', [
     *     34853523142692495808479485503424878684430196596020091237715106250497712463899n,
     *     17
     * ])
     * console.log(data)
     * // Outputs:
     * // {EventTwo: [17n, 'triggered']}
     *
     * @param {string} contract - The contract name as defined in the ACI.
     * @param {string} encodedData - Event encoded data
     * @param {Array} topics - A list of event topics.
     * First element should be the implicit topic that carry the event constructor name.
     */
    decodeEvent(contract, data, topics) {
        return this._internalEncoder.decodeEvent(contract, data, topics)
    }
}

module.exports = Encoder

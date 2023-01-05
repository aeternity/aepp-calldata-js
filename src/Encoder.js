const ContractByteArrayEncoder = require('./ContractByteArrayEncoder')
const AciTypeResolver = require('./AciTypeResolver')
const ApiEncoder = require('./ApiEncoder')
const EventEncoder = require('./EventEncoder')
const CanonicalMapper = require('./Mapper/CanonicalMapper')
const {FateTypeCalldata, FateTypeString} = require('./FateTypes')
const EncoderError = require('./Errors/EncoderError')

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
        /** @type {ContractByteArrayEncoder} */
        this._byteArrayEncoder = new ContractByteArrayEncoder()

        /** @type {AciTypeResolver} */
        this._typeResolver = new AciTypeResolver(aci)

        /** @type {ApiEncoder} */
        this._apiEncoder = new ApiEncoder()

        /** @type {EventEncoder} */
        this._eventEncoder = new EventEncoder()

        /** @type {CanonicalMapper} */
        this._canonicalMapper = new CanonicalMapper()
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
        const {types, required} = this._typeResolver.getCallTypes(contract, funName)

        if (args.length > types.length || args.length < required) {
            throw new EncoderError(
                'Non matching number of arguments. '
                + `${funName} expects between ${required} and ${types.length} number of arguments but got ${args.length}`
            )
        }

        // fill in the options arguments
        while (args.length < types.length) {
            args.push(undefined)
        }

        return this._byteArrayEncoder.encode(FateTypeCalldata(funName, types), args)
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
        const type = this._typeResolver.getReturnType(contract, funName)

        return this._byteArrayEncoder.decodeWithType(data, type)
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
        return this._byteArrayEncoder.decode(data)
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
        const decoder = new TextDecoder()
        const bytes = this._apiEncoder.decodeWithType(data, 'contract_bytearray')

        return decoder.decode(bytes)
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
        return this._byteArrayEncoder.decodeWithType(data, FateTypeString())
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
        const type = this._typeResolver.getEventType(contract, topics)

        return this._eventEncoder.decodeWithType(data, type)
    }
}

module.exports = Encoder

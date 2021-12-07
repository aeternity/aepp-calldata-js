const base64check = require('./utils/base64check')
const Serializer = require('./Serializer')
const TypeResolver = require('./TypeResolver')
const DataFactory = require('./DataFactory')
const CanonicalMapper = require('./Mapper/CanonicalMapper')
const InternalMapper = require('./Mapper/InternalMapper')
const Calldata = require('./Calldata')
const {FateTypeString} = require('./FateTypes')
const EncoderError = require('./Errors/EncoderError')
const FormatError = require('./Errors/FormatError')

class Encoder {
    /** @type {Object} */
    #aci

    /** @type {Serializer} */
    #serializer

    /** @type {TypeResolver} */
    #typeResolver

    /** @type {DataFactory} */
    #dataFactory

    /** @type {CanonicalMapper} */
    #mapper

    /**
     * Creates contract encoder
     *
     * @example
     * const ACI = require('./Test.json')
     * const encoder = new Encoder(ACI)
     *
     * @param {Object} aci - The contarct ACI in a cannonical form as POJO.
    */
    constructor(aci) {
        this.#aci = aci
        this.#serializer = new Serializer()
        this.#dataFactory = new DataFactory(new InternalMapper())
        this.#typeResolver = new TypeResolver(aci)
        this.#mapper = new CanonicalMapper()
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
     * @param {string} contarct - The contarct name as defined in the ACI.
     * @param {string} funName - The function name as defined in the ACI.
     * @param {Array} args - An array of call arguments as Javascript data structures. See README.md
     * @returns {string} Encoded calldata
    */
    encode(contract, funName, args) {
        const {types, required} = this.#typeResolver.getCallTypes(contract, funName)

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

        const argsData = this.#dataFactory.create(types, args)
        const calldata = Calldata(funName, types, argsData)
        const serialized = this.#serializer.serialize(calldata)
        const data = new Uint8Array(serialized.flat(Infinity))

        return 'cb_' + base64check.encode(data)
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
     * @param {string} contarct - The contarct name as defined in the ACI.
     * @param {string} funName - The function name as defined in the ACI.
     * @param {string} data - The call return value in a cannonical format.
     * @returns {boolean|string|BigInt|Array|Map|Object}
     *  Decoded value as Javascript data structures. See README.md
    */
    decode(contract, funName, data) {
        const type = this.#typeResolver.getReturnType(contract, funName)
        const binData = this.decodeString(data)
        const deserialized = this.#serializer.deserialize(type, binData)

        return deserialized.accept(this.#mapper)
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
        if (!data.startsWith('cb_')) {
            throw new FormatError('Invalid data format (missing cb_ prefix)')
        }

        return base64check.decode(data.substring(3))
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
        const binData = this.decodeString(data)
        const deserialized = this.#serializer.deserialize(FateTypeString(), binData)

        return deserialized.accept(this.#mapper)
    }
}

module.exports = Encoder

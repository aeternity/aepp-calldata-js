const base64check = require('./utils/base64check')
const Serializer = require('./Serializer')
const TypeResolver = require('./TypeResolver')
const CompositeDataFactory = require('./DataFactory/CompositeDataFactory')
const ExternalDataFactory = require('./ExternalDataFactory')
const CanonicalMapper = require('./Mapper/CanonicalMapper')
const InternalMapper = require('./Mapper/InternalMapper')
const Calldata = require('./Calldata')
const {FateTypeString} = require('./FateTypes')
const EncoderError = require('./Errors/EncoderError')
const FormatError = require('./Errors/FormatError')

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
        /** @type {Object} */
        this._aci = aci

        /** @type {Serializer} */
        this._serializer = new Serializer()

        /** @type {CompositeDataFactory} */
        this._dataFactory = new CompositeDataFactory()

        /** @type {ExternalDataFactory} */
        this._externalDataFactory = new ExternalDataFactory(new InternalMapper())

        /** @type {TypeResolver} */
        this._typeResolver = new TypeResolver(aci)

        /** @type {InternalMapper} */
        this._internalMapper = new InternalMapper()

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

        const argsData = this._externalDataFactory.createMultiple(types, args)
        const calldata = Calldata(funName, types, argsData)
        const serialized = this._serializer.serialize(calldata)
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
     * @param {string} contract - The contract name as defined in the ACI.
     * @param {string} funName - The function name as defined in the ACI.
     * @param {string} data - The call return value in a canonical format.
     * @returns {boolean|string|BigInt|Array|Map|Object}
     *  Decoded value as Javascript data structures. See README.md
    */
    decode(contract, funName, data) {
        const type = this._typeResolver.getReturnType(contract, funName)
        const binData = this.decodeString(data)
        const deserialized = this._serializer.deserialize(type, binData)

        return deserialized.accept(this._canonicalMapper)
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
        const deserialized = this._serializer.deserialize(FateTypeString(), binData)

        return deserialized.accept(this._canonicalMapper)
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
    decodeEvent(contract, encodedData, topics) {
        const data = this.decodeString(encodedData)
        const type = this._typeResolver.getEventType(contract)
        const event = {topics, data}
        const variant = this._dataFactory.create(type, event)

        return variant.accept(this._canonicalMapper)
    }
}

module.exports = Encoder

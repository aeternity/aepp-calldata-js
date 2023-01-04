const ContractByteArrayEncoder = require('./ContractByteArrayEncoder')
const AciTypeResolver = require('./AciTypeResolver')
const ApiEncoder = require('./ApiEncoder')
const EventEncoder = require('./EventEncoder')
const CanonicalMapper = require('./Mapper/CanonicalMapper')
const {FateTypeCalldata, FateTypeString} = require('./FateTypes')
const EncoderError = require('./Errors/EncoderError')

class AciContractCallEncoder {
    /**
     * Creates contract encoder using ACI as type info provider
     *
     * @example
     * const ACI = require('./Test.json')
     * const encoder = new AciContractCallEncoder(ACI)
     *
     * @param {Object} aci - The contract ACI in a canonical (CLI compiler) form as POJO.
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
     * Creates contract call data
     *
     * @example
     * const encoded = encoder.encodeCall('Test', 'test_string', ["whoolymoly"])
     * console.log(`Encoded data: ${encoded}`)
     * // Outputs:
     * // Encoded data: cb_KxHwzCuVGyl3aG9vbHltb2x5zwMSnw==
     *
     * @param {string} contract - The contract name as defined in the ACI.
     * @param {string} funName - The function name as defined in the ACI.
     * @param {Array} args - An array of call arguments as Javascript data structures. See README.md
     * @returns {string} Encoded calldata
    */
    encodeCall(contract, funName, args) {
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
     * Decodes contract calldata
     *
     * @example
     * const data = encoder.decodeCall('Test', 'test_string', 'cb_KxHwzCuVGyl3aG9vbHltb2x5zwMSnw==')
     * console.log(`Decoded data: ${data}`)
     * // Outputs:
     * // Decoded data: ["whoolymoly"]
     *
     * @param {string} contract - The contract name as defined in the ACI.
     * @param {string} funName - The function name as defined in the ACI.
     * @param {string} data - Encoded calldata in canonical format.
     * @returns {string} Decoded data
    */
    decodeCall(contract, funName, data) {
        const {types, _required} = this._typeResolver.getCallTypes(contract, funName)
        const calldataType = FateTypeCalldata(funName, types)

        return this._byteArrayEncoder.decodeWithType(data, calldataType)
    }

    /**
     * Decodes successful (resultType = ok) contract call return data
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
     * @param {'ok'|'revert'|'error'} resultType - The call result type.
     * @returns {boolean|string|BigInt|Array|Map|Object}
     *  Decoded value as Javascript data structures. See README.md
    */
    decodeResult(contract, funName, data, resultType = 'ok') {
        if (resultType === 'ok') {
            const type = this._typeResolver.getReturnType(contract, funName)

            return this._byteArrayEncoder.decodeWithType(data, type)
        }

        if (resultType === 'error') {
            const decoder = new TextDecoder()
            const bytes = this._apiEncoder.decodeWithType(data, 'contract_bytearray')

            return decoder.decode(bytes)
        }

        if (resultType === 'revert') {
            return this._byteArrayEncoder.decodeWithType(data, FateTypeString())
        }

        throw new EncoderError(`Unknown call result type: "${resultType}"`)
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
     * @param {BigInt[]} topics - A list of event topics.
     * First element should be the implicit topic that carry the event constructor name.
     */
    decodeEvent(contract, data, topics) {
        const type = this._typeResolver.getEventType(contract, topics)

        return this._eventEncoder.decodeWithType(data, type)
    }
}

module.exports = AciContractCallEncoder

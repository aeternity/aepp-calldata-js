import InternalEncoder from '../AciContractCallEncoder.js'

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
        this._internalEncoder = new InternalEncoder(aci)
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
        return this._internalEncoder.encodeCall(contract, funName, args)
    }

    /**
     * Decodes contract calldata
     *
     * @example
     * const data = encoder.decodeCall('Test', 'test_string', 'cb_KxHwzCuVGyl3aG9vbHltb2x5zwMSnw==')
     * console.log(`Decoded data: ${data}`)
     * // Outputs:
     * // Decoded data: { functionId: "f0cc2b95", args: ["whoolymoly"] }
     *
     * @param {string} contract - The contract name as defined in the ACI.
     * @param {string} funName - The function name as defined in the ACI.
     * @param {string} data - Encoded calldata in canonical format.
     * @returns {string} Decoded data
    */
    decodeCall(contract, funName, data) {
        return this._internalEncoder.decodeCall(contract, funName, data)
    }

    /**
     * * Decodes function details by contract calldata
     *
     * @example
     * const data = encoder.decodeFunction('cb_KxHwzCuVGyl3aG9vbHltb2x5zwMSnw==')
     * console.log(`Decoded data: ${data}`)
     * // Outputs:
     * // Decoded data: {
     * //   contractName: "Test",
     * //   functionName: "test_string",
     * //   functionId: "f0cc2b95",
     * // }
     *
     * @param {string} data - Encoded calldata in canonical format.
     * @returns {object} Decoded function details
    */
    decodeFunction(data) {
        return this._internalEncoder.decodeFunction(data)
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
        return this._internalEncoder.decodeResult(contract, funName, data, resultType)
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
        return this._internalEncoder.decodeEvent(contract, data, topics)
    }
}

export default AciContractCallEncoder

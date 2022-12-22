const InternalEncoder = require('../BytecodeContractCallEncoder')

class BytecodeContractCallEncoder {
    /**
     * Creates contract encoder using bytecode as type info provider
     *
     * @example
     * const bytecode = require('./Test.aeb')
     * const encoder = new BytecodeContractCallEncoder(bytecode)
     *
     * @param {string} bytecode - Contract bytecode using cannonical format.
    */
    constructor(bytecode) {
        this._internalEncoder = new InternalEncoder(bytecode)
    }

    /**
     * Creates contract call data
     *
     * @example
     * const encoded = encoder.encodeCall('test_string', ["whoolymoly"])
     * console.log(`Encoded data: ${encoded}`)
     * // Outputs:
     * // Encoded data: cb_KxHwzCuVGyl3aG9vbHltb2x5zwMSnw==
     *
     * @param {string} funName - The function name as defined in the bytecode.
     * @param {Array} args - An array of call arguments as Javascript data structures. See README.md
     * @returns {string} Encoded calldata
    */
    encodeCall(funName, args) {
        return this._internalEncoder.encodeCall(funName, args)
    }

    /**
     * Decodes contract calldata
     *
     * @example
     * const data = encoder.decodeCall('cb_KxHwzCuVGyl3aG9vbHltb2x5zwMSnw==')
     * console.log('Decoded data:', data)
     * // Outputs:
     * // Decoded data: {
     * //   functionId: 'aee52c3c',
     * //   functionName: 'test_template_maze',
     * //   args: [ 'whoolymoly' ]
     * // }
     *
     * @param {string} data - Encoded calldata in canonical format.
     * @returns {object} Decoded calldata
    */
    decodeCall(data) {
        return this._internalEncoder.decodeCall(data)
    }

    /**
     * Decodes successful (resultType = ok) contract call return data
     *
     * @example
     * const decoded = encoder.decode('test_string', 'cb_KXdob29seW1vbHlGazSE')
     * console.log(`Decoded data: ${decoded}`)
     * // Outputs:
     * // Decoded data: whoolymoly
     *
     * @param {string} data - The call return value in a canonical format.
     * @param {'ok'|'revert'|'error'} resultType - The call result type.
     * @returns {boolean|string|BigInt|Array|Map|Object}
     *  Decoded value as Javascript data structures. See README.md
    */
    decodeResult(data, resultType = 'ok') {
        return this._internalEncoder.decodeResult(data, resultType)
    }
}

module.exports = BytecodeContractCallEncoder

const ContractByteArrayEncoder = require('./ContractByteArrayEncoder')
const BytecodeTypeResolver = require('./BytecodeTypeResolver')
const ApiEncoder = require('./ApiEncoder')
const EventEncoder = require('./EventEncoder')
const {FateTypeCalldata, FateTypeString} = require('./FateTypes')
const EncoderError = require('./Errors/EncoderError')

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
        /** @type {ContractByteArrayEncoder} */
        this._byteArrayEncoder = new ContractByteArrayEncoder()

        /** @type {BytecodeTypeResolver} */
        this._typeResolver = new BytecodeTypeResolver(bytecode)

        /** @type {ApiEncoder} */
        this._apiEncoder = new ApiEncoder()

        /** @type {EventEncoder} */
        this._eventEncoder = new EventEncoder()
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
        const {types, required} = this._typeResolver.getCallTypes(funName)

        if (args.length > types.length || args.length < required) {
            throw new EncoderError(
                'Non matching number of arguments. '
                + `${funName} expects between ${required} and ${types.length} number of arguments but got ${args.length}`
            )
        }

        return this._byteArrayEncoder.encode(FateTypeCalldata(funName, types), args)
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
        const {functionId, args} = this._byteArrayEncoder.decodeWithType(data, FateTypeCalldata())
        const functionName = this._typeResolver.getFunctionName(functionId)

        return {
            functionId,
            functionName,
            args
        }
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
     * @param {string} funName - The function name as defined in the bytecode.
     * @param {string} data - The call return value in a canonical format.
     * @param {'ok'|'revert'|'error'} resultType - The call result type.
     * @returns {boolean|string|BigInt|Array|Map|Object}
     *  Decoded value as Javascript data structures. See README.md
    */
    decodeResult(funName, data, resultType = 'ok') {
        if (resultType === 'ok') {
            const type = this._typeResolver.getReturnType(funName)

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

        throw new EncoderError(`Unknown call resutls type: "${resultType}"`)
    }
}

module.exports = BytecodeContractCallEncoder

const bs58 = require('bs58')
const { addChecksum, getPayload } = require('./base64check')

/**
 * Base58check encode given `input`
 * @rtype (input: String|buffer) => Buffer
 * @param {Buffer} input - Data to encode
 * @return {String} Base58check encoded data
 */
const encode = (input) => {
    return bs58.encode(addChecksum(input))
}

/**
 * Base58check decode given `str`
 * @rtype (str: String) => Buffer
 * @param {String} str - Data to decode
 * @return {Buffer} Base58check decoded data
 */
const decode = (str) => {
    return getPayload(bs58.decode(str))
}

module.exports = {
    encode,
    decode
}

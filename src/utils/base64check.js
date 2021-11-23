const shajs = require('sha.js')

const sha256hash = (input) => {
    return shajs('sha256').update(input).digest()
}

const checkSumFn = (payload) => {
    return sha256hash(sha256hash(payload)).slice(0, 4)
}

/**
 * Base64check encode given `input`
 * @rtype (input: String|buffer) => Buffer
 * @param {String} input - Data to encode
 * @return {Buffer} Base64check encoded data
 */
const encode = (input) => {
    const buffer = Buffer.from(input)
    const checksum = checkSumFn(input)
    const payloadWithChecksum = Buffer.concat([buffer, checksum], buffer.length + 4)

    return payloadWithChecksum.toString('base64')
}

/**
 * Base64check decode given `str`
 * @rtype (str: String) => Buffer
 * @param {String} str - Data to decode
 * @return {Buffer} Base64check decoded data
 */
const decode = (str) => {
    const buffer = Buffer.from(str, 'base64')
    const payload = buffer.slice(0, -4)
    const checksum = buffer.slice(-4)
    const newChecksum = checkSumFn(payload)

    if (!checksum.equals(newChecksum)) {
        throw new Error('Invalid checksum')
    }

    return Buffer.from(payload)
}

module.exports = {
    encode,
    decode
}

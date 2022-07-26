const Sha256 = require('sha.js/sha256')
const { Buffer } = require('safe-buffer')
const FormatError = require('../Errors/FormatError')

const sha256hash = (input) => {
    return new Sha256().update(input).digest()
}

const checkSumFn = (payload) => {
    return sha256hash(sha256hash(payload)).slice(0, 4)
}

const addChecksum = (payload) => {
    const buffer = Buffer.from(payload)
    const checksum = checkSumFn(payload)
    return Buffer.concat([buffer, checksum], buffer.length + 4)
}

const getPayload = (payloadWithChecksum) => {
    const payload = payloadWithChecksum.slice(0, -4)
    const checksum = payloadWithChecksum.slice(-4)
    const newChecksum = checkSumFn(payload)

    if (!checksum.equals(newChecksum)) {
        throw new FormatError('Invalid checksum')
    }

    return payload
}

/**
 * Base64check encode given `input`
 * @rtype (input: String|buffer) => Buffer
 * @param {String|Buffer} input - Data to encode
 * @return {String} Base64check encoded data
 */
const encode = (input) => {
    return addChecksum(input).toString('base64')
}

/**
 * Base64check decode given `str`
 * @rtype (str: String) => Buffer
 * @param {String} str - Data to decode
 * @return {Buffer} Base64check decoded data
 */
const decode = (str) => {
    return getPayload(Buffer.from(str, 'base64'))
}

module.exports = {
    addChecksum,
    getPayload,
    encode,
    decode
}

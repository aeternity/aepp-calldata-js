import bs58 from 'bs58'
import { addChecksum, getPayload } from './base64check.js'

/**
 * Base58check encode given `input`
 * @param {Buffer} input - Data to encode
 * @return {String} Base58check encoded data
 */
const encode = (input) => {
    return bs58.encode(addChecksum(input))
}

/**
 * Base58check decode given `str`
 * @param {String} str - Data to decode
 * @return {Uint8Array} Base58check decoded data
 */
const decode = (str) => {
    return getPayload(bs58.decode(str))
}

export {
    encode,
    decode
}

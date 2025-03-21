import FormatError from '../Errors/FormatError.js'

// TODO consider using Buffer.from(<string>, 'hex') instead
// TODO get rid of this ?
// int2ByteArray(BigInt('0x' + hex.join('')))
const hexStringToByteArray = (str) => {
    const match = str.match(/^(0x)?([a-f0-9]*)$/i)
    if (!match) {
        throw new FormatError(`Invalid hex string: ${str}`)
    }

    return new Uint8Array(match[2]
        .split(/(.{1,2})/)
        .filter(el => el)
        .map(el => parseInt(el, 16)))
}

export default hexStringToByteArray

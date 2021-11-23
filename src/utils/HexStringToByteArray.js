// TODO consider using Buffer.from(<string>, 'hex') instead
const HexStringToByteArray = (str) => {
    const match = str.match(/^(0x)?([a-f0-9]*)$/i)
    if (!match) {
        throw new Error(`Invalid hex string: ${str}`)
    }

    return new Uint8Array(match[2]
        .split(/(.{1,2})/)
        .filter(el => el)
        .map(el => parseInt(el, 16)))
}

module.exports = HexStringToByteArray

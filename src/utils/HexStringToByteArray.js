// TODO consider using Buffer.from(<string>, 'hex') instead
const HexStringToByteArray = function (str) {
    const start = str.startsWith('0x') ? 2 : 0
    let ints = []

    for (let i = start, charsLength = str.length; i < charsLength; i += 2) {
        const [int1, int2] = [0, 1].map(j => parseInt(str[i + j], 16))
        const isOddEnd = i + 1 >= charsLength
        if (Number.isNaN(int1) || Number.isNaN(int2) && !isOddEnd) {
            throw new Error(`Invalid hex string: ${str}`)
        }
        ints.push(isOddEnd ? int1 : (int1 << 4) + int2)
    }

    return new Uint8Array(ints)
}

module.exports = HexStringToByteArray

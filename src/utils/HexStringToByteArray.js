const HexStringToByteArray = function (str) {
    const start = str.startsWith('0x') ? 2 : 0
    let ints = [];

    for (let i = start, charsLength = str.length; i < charsLength; i += 2) {
        const hex = str.substring(i, i + 2)
        ints.push(parseInt(hex, 16));
    }

    return new Uint8Array(ints)
}

module.exports = HexStringToByteArray

const Int2ByteArray = (value) => {
    const bigInt = BigInt(value)

    if (bigInt < 256n) {
        return new Uint8Array([Number(bigInt)])
    }

    return new Uint8Array([
        ...Int2ByteArray(bigInt >> 8n),
        Number(bigInt & 0xffn)
    ])
}

const ByteArrayToHexArray = (data) => {
    return [...data].map(x => x.toString(16).padStart(2, '0'))
}

const ByteArray2Int = (data) => {
    const hex = ByteArrayToHexArray(data)

    return BigInt('0x' + hex.join(''))
}

const ByteArray2IntBE = (data) => {
    const hex = ByteArrayToHexArray(data).reverse()

    return BigInt('0x' + hex.join(''))
}

const ByteArray2Hex = (data) => {
    return ByteArrayToHexArray(data).join('')
}

module.exports = {
    Int2ByteArray,
    ByteArray2Int,
    ByteArray2IntBE,
    ByteArray2Hex,
}

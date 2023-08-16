const int2ByteArray = (value) => {
    const bigInt = BigInt(value)

    if (bigInt < 256n) {
        return new Uint8Array([Number(bigInt)])
    }

    return new Uint8Array([
        ...int2ByteArray(bigInt >> 8n),
        Number(bigInt & 0xffn)
    ])
}

const byteArrayToHexArray = (data) => {
    return [...data].map(x => x.toString(16).padStart(2, '0'))
}

const byteArray2Int = (data) => {
    const hex = byteArrayToHexArray(data)

    return BigInt('0x' + hex.join(''))
}

const byteArray2IntBE = (data) => {
    const hex = byteArrayToHexArray(data).reverse()

    return BigInt('0x' + hex.join(''))
}

const byteArray2Hex = (data) => {
    return byteArrayToHexArray(data).join('')
}

module.exports = {
    int2ByteArray,
    byteArray2Int,
    byteArray2IntBE,
    byteArray2Hex,
}

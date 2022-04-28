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
    const hex = []

    data.forEach(i => {
        let h = i.toString(16)

        if (h.length % 2) {
            h = '0' + h
        }

        hex.push(h)
    })

    return hex
}

const ByteArray2Int = (data) => {
    const hex = ByteArrayToHexArray(data)

    return BigInt('0x' + hex.join(''))
}

const ByteArray2IntBE = (data) => {
    const hex = ByteArrayToHexArray(data).reverse()

    return BigInt('0x' + hex.join(''))
}

module.exports = {
    Int2ByteArray,
    ByteArray2Int,
    ByteArray2IntBE
}

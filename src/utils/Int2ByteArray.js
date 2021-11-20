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

const ByteArray2Int = (data) => {
    const hex = []

    data.forEach(i => {
        let h = i.toString(16)

        if (h.length % 2) {
            h = '0' + h
        }

        hex.push(h)
    })

    return BigInt('0x' + hex.join(''))
}

module.exports = {
    Int2ByteArray,
    ByteArray2Int
}

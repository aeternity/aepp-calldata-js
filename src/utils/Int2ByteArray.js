const Int2ByteArray =  (value) => {
    if (value < 256) {
        return new Uint8Array([Number(value)])
    }

    if (typeof value == 'bigint') {
        return new Uint8Array([
            ...Int2ByteArray(value >> 8n),
            Number(value & BigInt('0xff'))
        ])
    }

    return new Uint8Array([
        ...Int2ByteArray(value >> 8),
        value & 0xff
    ])
}

const ByteArray2Int = (data) => {
    const hex = [];

    data.forEach(i => {
        let h = i.toString(16)

        if (h.length % 2) {
            h = '0' + h;
        }

        hex.push(h)
    })

    return BigInt('0x' + hex.join(''))
}

module.exports = {
    Int2ByteArray,
    ByteArray2Int
}

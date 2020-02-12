const Int2ByteArray = function (value) {
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

module.exports = Int2ByteArray

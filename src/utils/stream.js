import RLP from 'rlp'

export function asU8(data) {
    return data instanceof Uint8Array ? data : new Uint8Array(data)
}

function readLength(buf, lenOfLen) {
    let len = 0

    for (let i = 1; i <= lenOfLen; i++) {
        len = len * 256 + buf[i]
    }

    return len
}

/**
 * Total byte length of the RLP item that starts at buf[0].
 */
function rlpItemLength(buf) {
    const b = buf[0]

    if (b <= 0x7f) {
        return 1
    }

    if (b <= 0xb7) {
        return 1 + (b - 0x80)
    }

    if (b <= 0xbf) {
        return 1 + (b - 0xb7) + readLength(buf, b - 0xb7)
    }

    if (b <= 0xf7) {
        return 1 + (b - 0xc0)
    }

    return 1 + (b - 0xf7) + readLength(buf, b - 0xf7)
}

/**
 * Same result as RLP.decode(buf, true), but the remainder is a view of the input.
 * The rlp package copies the whole remaining buffer, which makes decoding long
 * lists and maps quadratic.
 */
export function rlpDecodeStream(buf) {
    const n = Math.min(rlpItemLength(buf), buf.length)
    const decoded = RLP.decode(buf.subarray(0, n), true)

    return {data: decoded.data, remainder: buf.subarray(n)}
}

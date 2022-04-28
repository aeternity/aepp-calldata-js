const {Int2ByteArray, ByteArray2IntBE} = require('./Int2ByteArray')

const CURVES = {
    r: {
        R: 1n << 256n,
        N: 0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001n,
    },
    p: {
        R: 1n << 384n,
        /* eslint-disable-next-line max-len */
        N: 0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaabn,
    }
}

const xgcd = (a, b) => {
    if (b === 0n) {
        return [1n, 0n, a]
    }

    const [x, y, d] = xgcd(b, a % b)

    return [y, x - y * (a / b), d]
}

const invmod = (a, n) => {
    const [X, _Y, _D] = xgcd(a, n)

    // To ensure positive result
    return (X + n) % n
}

// Scalar(a) = aR mod N
const Int2MontBytes = (value, curveType) => {
    const curve = CURVES[curveType]
    const a = BigInt(value)
    const m = (a * curve.R) % curve.N

    return Int2ByteArray(m)
}

// a = ã · R^−1 mod N
const MontBytes2Int = (value, curveType) => {
    const curve = CURVES[curveType]
    const a = ByteArray2IntBE(value)
    const Rinv = invmod(curve.R, curve.N)

    return (a * Rinv) % curve.N
}

module.exports = {
    Int2MontBytes,
    MontBytes2Int,
}

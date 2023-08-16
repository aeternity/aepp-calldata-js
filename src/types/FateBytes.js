const FateData = require('./FateData')
const {int2ByteArray} = require('../utils/int2ByteArray')
const hexStringToByteArray = require('../utils/hexStringToByteArray')
const FateTypeError = require('../Errors/FateTypeError')

const toByteArray = (value, size = 0) => {
    if (Array.isArray(value) || ArrayBuffer.isView(value)) {
        return new Uint8Array(value)
    }

    if (typeof value === 'string') {
        return hexStringToByteArray(value)
    }

    if (typeof value !== 'bigint' && !Number.isInteger(value)) {
        throw new FateTypeError(
            'byte_array',
            `Should be one of: Array, ArrayBuffer, hex string, Number, BigInt; got ${value} instead`
        )
    }

    const bytes = int2ByteArray(value)
    if (bytes.length >= size) {
        return bytes
    }

    // pad the byte array with 0 significant bytes, because int representation lost
    const fixedSize = new Uint8Array(size)
    fixedSize.set(bytes, size - bytes.length)

    return fixedSize
}

class FateBytes extends FateData {
    constructor(value, size, name = 'bytes') {
        super(name)

        this._value = toByteArray(value, size)

        if (size && this._value.byteLength !== size) {
            throw new FateTypeError(
                name,
                `Invalid length: got ${this._value.byteLength} bytes instead of ${size} bytes`
            )
        }

        this._size = size
    }

    get value() {
        return this._value
    }

    get size() {
        return this._size
    }

    valueOf() {
        return this._value
    }
}

module.exports = FateBytes

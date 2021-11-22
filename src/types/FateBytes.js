const FateData = require('./FateData')
const {Int2ByteArray} = require('../utils/Int2ByteArray')
const HexStringToByteArray = require('../utils/HexStringToByteArray')
const bs58check = require('bs58check')

const toByteArray = (value) => {
    if (Array.isArray(value) || ArrayBuffer.isView(value)) {
        return new Uint8Array(value)
    }

    if (typeof value === 'string') {
        return HexStringToByteArray(value)
    }

    if (typeof value !== 'bigint' && !Number.isInteger(value)) {
        throw new Error(`Should be one of: Array, ArrayBuffer, hex string, Number, BigInt; got ${value} instead`)
    }

    return Int2ByteArray(value)
}

class FateBytes extends FateData {
    constructor(value, size, name = 'bytes') {
        super(name)

        this._value = toByteArray(value)

        if (size && this._value.byteLength !== size) {
            throw new Error(`Invalid length: got ${this._value.byteLength} bytes instead of ${size} bytes`)
        }

        this._size = size
    }

    get value() {
        return this._value
    }

    get size() {
        return this._size
    }

    base58Encode(prefix) {
        return prefix + '_' + bs58check.encode(this.value)
    }

    valueOf() {
        return this._value
    }
}

module.exports = FateBytes

const FateData = require('./FateData')
const FateTypeError = require('../Errors/FateTypeError')

class FateBls12381Field extends FateData {
    constructor(value, size, name) {
        super(name)

        if (!Array.isArray(value) && !ArrayBuffer.isView(value)) {
            throw new FateTypeError(
                name,
                `Should be one of: Array or ArrayBuffer; got ${value} instead`
            )
        }

        const buff = new Uint8Array(value)

        if (buff.byteLength !== size) {
            throw new FateTypeError(
                name,
                `Invalid length: got ${buff.byteLength} bytes instead of ${size} bytes`
            )
        }

        this._value = buff
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

module.exports = FateBls12381Field

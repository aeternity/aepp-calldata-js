const FateData = require('./FateData')
const {FateTypeString} = require('../FateTypes')
const { byteArray2Int } = require('../utils/int2ByteArray')

const toString = (data) => {
    if (data instanceof Uint8Array) {
        const decoder = new TextDecoder()
        return decoder.decode(data)
    }

    return data.toString()
}

const toBytes = (data) => {
    if (typeof data === 'string') {
        const encoder = new TextEncoder()
        return encoder.encode(data)
    }

    return data
}

const isUnicodeString = (data) => {
    const bytes = toBytes(toString(data))
    return byteArray2Int(data) === byteArray2Int(bytes)
}

class FateString extends FateData {
    constructor(value) {
        super('string')

        this._value = toBytes(value)
    }

    get type() {
        return FateTypeString()
    }

    toString() {
        return toString(this._value)
    }

    toBytes() {
        return this._value
    }

    valueOf() {
        if (isUnicodeString(this._value)) {
            return this.toString()
        }

        return this._value
    }
}

module.exports = FateString

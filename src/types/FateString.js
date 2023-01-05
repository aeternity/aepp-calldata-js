const FateData = require('./FateData')
const {FateTypeString} = require('../FateTypes')

const toString = (data) => {
    if (data instanceof Uint8Array) {
        const decoder = new TextDecoder()
        return decoder.decode(data)
    }

    return data.toString()
}

class FateString extends FateData {
    constructor(value) {
        super('string')

        this._value = toString(value)
    }

    get type() {
        return FateTypeString()
    }

    toString() {
        return this._value
    }

    valueOf() {
        return this._value
    }
}

module.exports = FateString

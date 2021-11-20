const FateData = require('./FateData')
const {FateTypeString} = require('../FateTypes')

class FateString extends FateData {
    constructor(value) {
        super('string')

        this._value = value.toString()
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

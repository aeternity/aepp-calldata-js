const FateData = require('./FateData')
const {FateTypeInt} = require('../FateTypes')

class FateInt extends FateData {
    constructor(value) {
        super('int')

        this._value = BigInt(value)
    }

    get value() {
        return this._value
    }

    get type() {
        return FateTypeInt()
    }

    valueOf() {
        return this._value
    }
}

module.exports = FateInt

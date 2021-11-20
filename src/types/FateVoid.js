const FateData = require('./FateData')
const {FateTypeVoid} = require('../FateTypes')

class FateVoid extends FateData {
    constructor() {
        super('void')

        this._value = undefined
    }

    get value() {
        return this._value
    }

    get type() {
        return FateTypeVoid()
    }

    valueOf() {
        return this._value
    }
}

module.exports = FateVoid

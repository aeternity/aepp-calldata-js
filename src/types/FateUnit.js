const FateData = require('./FateData')
const {FateTypeUnit} = require('../FateTypes')

class FateUnit extends FateData {
    constructor() {
        super('unit')

        this._value = undefined
    }

    get value() {
        return this._value
    }

    get type() {
        return FateTypeUnit()
    }

    valueOf() {
        return this._value
    }

    accept(visitor) {
        return visitor.visitUnit(this)
    }
}

module.exports = FateUnit

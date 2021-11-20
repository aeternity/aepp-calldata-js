const FateData = require('./FateData')
const {FateTypeBool} = require('../FateTypes')

class FateBool extends FateData {
    constructor(value) {
        super('bool')

        if (typeof value !== 'boolean') {
            throw new Error(`"${value}" must be a boolean`)
        }
        this._value = value
    }

    get value() {
        return this._value
    }

    get type() {
        return FateTypeBool()
    }

    valueOf() {
        return this._value
    }
}

module.exports = FateBool

const FateData = require('./FateData.js')
const {FateTypeBool} = require('../FateTypes.js')

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

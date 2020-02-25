const FateData = require('./FateData.js')
const {FateTypeString} = require('../FateTypes.js')

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
}

module.exports = FateString

const FateData = require('./FateData.js')
const {FateTypeVoid} = require('../FateTypes.js')

class FateVoid extends FateData {
  constructor(value) {
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

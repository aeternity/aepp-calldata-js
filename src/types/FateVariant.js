const FateData = require('./FateData.js')
const {FateTypeVariant, FateTypeTuple, FateTypeInt} = require('../FateTypes.js')

class FateVariant extends FateData {
  constructor(arities, tag, value = [], valueTypes = []) {
    super('variant')

    this.arities = Array.from(arities)
    this._tag = tag

    this._value = value
    this._valueTypes = valueTypes

    this._type = FateTypeVariant(arities, valueTypes)
  }

  get valueTypes() {
    return this._valueTypes
  }

  get type() {
    return this._type
  }

  get tag() {
    return this._tag
  }

  get value() {
    return this._value
  }

  get aritiesType() {
    return FateTypeInt()
  }

  get variantType() {
    return FateTypeTuple(this._valueTypes)
  }
}

module.exports = FateVariant

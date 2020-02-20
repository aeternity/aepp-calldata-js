const {FateType, FateTypeMap} = require('../FateTypes.js')

const arrayToItem = (item) => {
  const [key, value] = item
  return {key, value}
}

class FateMap {
  constructor(keyType, valueType, items = []) {
    // BC
    this.name = 'map'

    this._keyType = FateType(keyType)
    this._valueType = FateType(valueType)
    this._type = FateTypeMap(keyType, valueType)
    this.items = items.map(arrayToItem)
  }

  get keyType() {
    return this._keyType
  }

  get valueType() {
    return this._valueType
  }

  get type() {
    return this._type
  }

  get length() {
    return this.items.length
  }
}

module.exports = FateMap

const FateData = require('./FateData.js')
const {FateTypeTuple} = require('../FateTypes.js')

const zipObject = (keys, values) => {
  return keys.reduce((acc, k, i) => (acc[k] = values[i], acc), {})
}

class FateTuple extends FateData {
  constructor(valueTypes = [], items = []) {
    super('tuple')

    this._valueTypes = (valueTypes.hasOwnProperty('valueTypes')) ? valueTypes.valueTypes : valueTypes
    this._type = Array.isArray(valueTypes) ? FateTypeTuple(valueTypes) : valueTypes
    this._items = Array.from(items)
  }

  get valueTypes() {
    return this._valueTypes
  }

  get type() {
    return this._type
  }

  get size() {
    return this._items.length
  }

  get items() {
    return this._items
  }

  valueOf() {
    const items = this._items.map(e => e.valueOf())

    if (this._type.name === 'record') {
      return zipObject(this._type.keys, items)
    }

    return items
  }
}

module.exports = FateTuple

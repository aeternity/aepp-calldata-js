const {FateTypeList} = require('../FateTypes.js')

class FateList {
  constructor(itemsType, items = []) {
    // BC
    this.name = 'list'

    this._itemsType = itemsType
    this.items = Array.from(items)
  }

  get itemsType() {
    return this._itemsType
  }

  get type() {
    return FateTypeList(this.itemsType)
  }

  get length() {
    return this.items.length
  }
}

module.exports = FateList

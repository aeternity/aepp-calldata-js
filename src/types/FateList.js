const FateData = require('./FateData.js')
const {FateTypeList} = require('../FateTypes.js')

class FateList extends FateData {
  constructor(itemsType, items = []) {
    super('list')

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

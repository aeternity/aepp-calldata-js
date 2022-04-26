const FateData = require('./FateData')
const {FateTypeSet} = require('../FateTypes')

class FateSet extends FateData {
    constructor(itemsType, items = []) {
        super('set')

        this._itemsType = itemsType
        this._items = new Set(items)
    }

    get items() {
        return Array.from(this._items.values())
    }

    get itemsType() {
        return this._itemsType
    }

    get type() {
        return FateTypeSet(this.itemsType)
    }

    get length() {
        return this._items.size
    }

    valueOf() {
        return new Set(this.items.map(e => e.valueOf()))
    }

    accept(visitor) {
        return visitor.visitSet(this)
    }
}

module.exports = FateSet

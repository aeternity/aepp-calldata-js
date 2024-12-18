import FateData from './FateData.js'
import {FateTypeList} from '../FateTypes.js'

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

    valueOf() {
        return this.items.map(e => e.valueOf())
    }

    accept(visitor) {
        return visitor.visitList(this)
    }
}

export default FateList

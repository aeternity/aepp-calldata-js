const FateData = require('./FateData')
const {FateTypeTuple} = require('../FateTypes')

const zipObject = (keys, values) => {
    const reducer = (acc, k, i) => {
        acc[k] = values[i]
        return acc
    }

    return keys.reduce(reducer, {})
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
        return this.prepareItems(e => e.valueOf())
    }

    prepareItems(callback) {
        const items = this._items.map(callback)

        if (this._type.name === 'record') {
            return zipObject(this._type.keys, items)
        }

        return items
    }

    accept(visitor) {
        return visitor.visitTuple(this)
    }
}

module.exports = FateTuple

const FateData = require('./FateData')
const {FateTypeMap} = require('../FateTypes')

const arrayToItem = (item) => {
    const [key, value] = item
    return {key, value}
}

class FateMap extends FateData {
    constructor(keyType, valueType, items = []) {
        super('map')

        this._keyType = keyType
        this._valueType = valueType
        this._type = FateTypeMap(keyType, valueType)
        this._value = new Map(items)
    }

    get items() {
        return [...this._value.entries()].map(arrayToItem)
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
        return this._value.size
    }

    get iterator() {
        return this._value[Symbol.iterator]()
    }

    get keys() {
        return this._value.keys()
    }

    valueOf() {
        const map = new Map()
        for (const [key, value] of this.iterator) {
            map.set(key.valueOf(), value.valueOf())
        }

        return map
    }

    accept(visitor) {
        return visitor.visitMap(this)
    }
}

module.exports = FateMap

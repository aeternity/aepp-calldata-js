const FateTag = require('../FateTag.js')
const FateInt = require('../types/FateInt.js')

ListSerializer = function (globalSerializer) {
    this.globalSerializer = globalSerializer
}

ListSerializer.prototype = {
    serialize: function (data) {
        // BC compatibility
        const list = Array.isArray(data) ? data[1] : data

        const serializedElements = list.items.map(e => {
            return this.globalSerializer.serialize([list.itemsType, e])
        }).flat(Infinity)

        const len = list.items.length

        if (len < 16) {
            const prefix = (len << 4) | FateTag.SHORT_LIST

            return [
                prefix,
                ...serializedElements
            ]
        }

        return [
            FateTag.LONG_LIST,
            ...this.globalSerializer.serialize(new FateInt(len - 16)),
            ...serializedElements
        ]
    }
}

module.exports = ListSerializer

const FateTag = require('../FateTag.js')

ListSerializer = function (globalSerializer) {
    this.globalSerializer = globalSerializer
}

ListSerializer.prototype = {
    serialize: function (value) {
        const [listType, elements] = value
        const serializedElements = elements.map(e => {
            return this.globalSerializer.serialize([listType.valuesType, e])
        }).flat(Infinity)

        const len = elements.length

        if (len < 16) {
            const prefix = (len << 4) | FateTag.SHORT_LIST

            return [
                prefix,
                ...serializedElements
            ]
        }

        return [
            FateTag.LONG_LIST,
            ...this.globalSerializer.serialize(['int', len - 16]),
            ...serializedElements
        ]
    }
}

module.exports = ListSerializer

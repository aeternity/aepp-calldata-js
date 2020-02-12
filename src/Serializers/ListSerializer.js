const FATE = require('../fate.js')

ListSerializer = function (globalSerializer) {
    this.globalSerializer = globalSerializer
}

ListSerializer.prototype = {
    serialize: function (value) {
        const [type, elements] = value
        const serializedElements = elements.map(e => this.globalSerializer.serialize([type, e])).flat(Infinity)
        const len = elements.length

        if (len < 16) {
            const prefix = (len << 4) | FATE.SHORT_LIST

            return [
                prefix,
                ...serializedElements
            ]
        }

        return [
            FATE.LONG_LIST,
            ...this.globalSerializer.serialize(['int', len - 16]),
            ...serializedElements
        ]
    }
}

module.exports = ListSerializer

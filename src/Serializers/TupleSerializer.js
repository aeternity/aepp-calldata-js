const FATE = require('../fate.js')

TupleSerializer = function (globalSerializer) {
    this.globalSerializer = globalSerializer
}

TupleSerializer.prototype = {
    serialize: function (value) {
        if (value.length === 0) {
            return [FATE.EMPTY_TUPLE]
        }

        const elements = value.map(e => this.globalSerializer.serialize(e)).flat(Infinity)

        if (value.length < 16) {
            const prefix = (value.length << 4) | FATE.SHORT_TUPLE

            return [
                prefix,
                ...elements
            ]
        }

        return [
            FATE.LONG_TUPLE,
            ...this.globalSerializer.serialize(['int', elements.length - 16]),
            ...elements
        ]
    }
}

module.exports = TupleSerializer

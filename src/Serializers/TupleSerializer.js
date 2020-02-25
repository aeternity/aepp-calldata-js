const FateTag = require('../FateTag.js')
const FateInt = require('../types/FateInt.js')

const zip = (arr, ...arrs) => {
  return arr.map((val, i) => arrs.reduce((a, arr) => [...a, arr[i]], [val]));
}

TupleSerializer = function (globalSerializer) {
    this.globalSerializer = globalSerializer
}

TupleSerializer.prototype = {
    serialize: function (tuple) {
        const len = tuple.size
        if (len === 0) {
            return [FateTag.EMPTY_TUPLE]
        }

        const elements = tuple.items
            .map(e => this.globalSerializer.serialize(e))
            .flat(Infinity)

        if (len < 16) {
            const prefix = (len << 4) | FateTag.SHORT_TUPLE

            return [
                prefix,
                ...elements
            ]
        }

        return [
            FateTag.LONG_TUPLE,
            ...this.globalSerializer.serialize(new FateInt(len - 16)),
            ...elements
        ]
    }
}

module.exports = TupleSerializer

const FateTag = require('../FateTag.js')

const zip = (arr, ...arrs) => {
  return arr.map((val, i) => arrs.reduce((a, arr) => [...a, arr[i]], [val]));
}

TupleSerializer = function (globalSerializer) {
    this.globalSerializer = globalSerializer
}

TupleSerializer.prototype = {
    serialize: function (data) {
        const [type, values] = data
        const len = values.length

        if (len === 0) {
            return [FateTag.EMPTY_TUPLE]
        }

        const elements = zip(type.valueTypes, values)
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
            ...this.globalSerializer.serialize(['int', len - 16]),
            ...elements
        ]
    }
}

module.exports = TupleSerializer

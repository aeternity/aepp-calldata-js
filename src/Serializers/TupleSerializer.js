const FateTag = require('../FateTag.js')
const FateInt = require('../types/FateInt.js')

const zip = (arr, ...arrs) => {
  return arr.map((val, i) => arrs.reduce((a, arr) => [...a, arr[i]], [val]));
}

TupleSerializer = function (globalSerializer) {
    this.globalSerializer = globalSerializer
}

TupleSerializer.prototype = {
    serialize: function (data) {
        let type, values

        // BC
        if (Array.isArray(data)) {
            [type, values] = data
            valueTypes = type.valueTypes
        } else {
            type = data.type
            values = data.items
            valueTypes = type.valueTypes
        }

        const len = values.length
        if (len === 0) {
            return [FateTag.EMPTY_TUPLE]
        }

        const elements = zip(valueTypes, values)
            .map(e => {
                const [t, v] = e
                return this.globalSerializer.serialize(v.hasOwnProperty('name') ? v : e)
            })
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

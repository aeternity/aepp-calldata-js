const FateTag = require('../FateTag.js')
const RLPInt = require('../utils/RLPInt.js')
const FateComparator = require('../FateComparator.js')

MapSerializer = function (globalSerializer) {
    this.globalSerializer = globalSerializer
}

MapSerializer.prototype = {
    serialize (data) {
        // BC compatibility
        const map = Array.isArray(data) ? data[1] : data

        const len = map.length
        const cmp = FateComparator(map.keyType)

        const sortedItems = [...map.items]
        sortedItems.sort((elA, elB) => cmp(elA.key, elB.key))

        const serializedItems = sortedItems.map(i => {
            return [
                this.globalSerializer.serialize([map.keyType, i.key]),
                this.globalSerializer.serialize([map.valueType, i.value])
            ]
        })

        return [
            FateTag.MAP,
            ...RLPInt(len),
            ...serializedItems.flat(Infinity)
        ]
    },
}

module.exports = MapSerializer

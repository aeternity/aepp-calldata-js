const FateTag = require('../FateTag.js')
const RLPInt = require('../utils/RLPInt.js')
const FateComparator = require('../FateComparator.js')

MapSerializer = function (globalSerializer) {
    this.globalSerializer = globalSerializer
}

MapSerializer.prototype = {
    serialize (map) {
        const len = map.length
        const cmp = FateComparator(map.keyType)

        const sortedItems = [...map.items]
        sortedItems.sort((elA, elB) => cmp(elA.key, elB.key))

        const serializedItems = sortedItems.map(i => {
            return [
                this.globalSerializer.serialize(i.key),
                this.globalSerializer.serialize(i.value)
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

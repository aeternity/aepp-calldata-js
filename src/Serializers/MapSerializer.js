const FateTag = require('../FateTag.js')
const RLPInt = require('../utils/RLPInt.js')
const FateComparator = require('../FateComparator.js')

MapSerializer = function (globalSerializer) {
    this.globalSerializer = globalSerializer
}

MapSerializer.prototype = {
    serialize (value) {
        const [keyKype, valueType, elements] = value
        const len = elements.length
        const cmp = FateComparator(keyKype)

        const sortedElements = [...elements]
        sortedElements.sort((elA, elB) => cmp(elA[0], elB[0]))

        const serializedElements = sortedElements.map(e => {
            const [key, value] = e
            return [
                this.globalSerializer.serialize([keyKype, key]),
                this.globalSerializer.serialize([valueType, value])
            ]
        })

        return [
            FateTag.MAP,
            ...RLPInt(len),
            ...serializedElements.flat(Infinity)
        ]
    },
}

module.exports = MapSerializer

const RLP = require('rlp')
const FateTag = require('../FateTag.js')
const RLPInt = require('../utils/RLPInt.js')
const {ByteArray2Int} = require('../utils/Int2ByteArray.js')
const FateComparator = require('../FateComparator.js')
const FateMap = require('../types/FateMap.js')

class MapSerializer {
    constructor(globalSerializer) {
        this.globalSerializer = globalSerializer
    }
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
    }
    deserialize(data, typeInfo) {
        const [value, rest] = this.deserializeStream(data, typeInfo)

        return value
    }
    deserializeStream(data, typeInfo) {
        const buffer = new Uint8Array(data)
        const prefix = buffer[0]

        if (prefix !== FateTag.MAP) {
            throw new Error("Invalid MAP prefix: " + prefix.toString(2))
        }

        const decoded = RLP.decode(buffer.slice(1), true)
        const len = ByteArray2Int(decoded.data)
        let rest = decoded.remainder

        if (len === 0n) {
            return [new FateMap(), rest]
        }

        let keyType = undefined
        let valueType = undefined
        let elements = []

        if (typeof typeInfo !== 'undefined') {
            ({keyType, valueType} = typeInfo)
        }

        for (let i = 0n; i < len; i++) {
            const keyData = this.globalSerializer.deserializeStream(rest, keyType)
            const valueData = this.globalSerializer.deserializeStream(keyData[1], valueType)

            elements.push([keyData[0], valueData[0]])
            rest = valueData[1]
        }

        const firstEl = elements[0]

        if (typeof typeInfo === 'undefined') {
            keyType = firstEl[0].type
            valueType = firstEl[1].type
        }

        return [
            new FateMap(
                keyType,
                valueType,
                elements
            ),
            rest
        ]
    }
}

module.exports = MapSerializer

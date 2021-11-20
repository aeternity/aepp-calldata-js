const RLP = require('rlp')
const FateTag = require('../FateTag')
const RLPInt = require('../utils/RLPInt')
const {ByteArray2Int} = require('../utils/Int2ByteArray')
const FateComparator = require('../FateComparator')
const FateMap = require('../types/FateMap')

class MapSerializer {
    constructor(globalSerializer) {
        this.globalSerializer = globalSerializer
    }

    serialize(map) {
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
        const [value, _rest] = this.deserializeStream(data, typeInfo)

        return value
    }

    deserializeStream(data, typeInfo) {
        const buffer = new Uint8Array(data)
        const prefix = buffer[0]

        if (prefix !== FateTag.MAP) {
            throw new Error('Invalid Map prefix: ' + prefix.toString(2))
        }

        const decoded = RLP.decode(buffer.slice(1), true)
        const len = ByteArray2Int(decoded.data)
        let rest = decoded.remainder

        if (len === 0n) {
            return [new FateMap(), rest]
        }

        let keyType
        let valueType

        if (typeof typeInfo !== 'undefined') {
            ({keyType, valueType} = typeInfo)
        }

        const elements = []
        for (let i = 0n; i < len; i++) {
            const [key, keyRest] = this.globalSerializer.deserializeStream(rest, keyType)
            const [value, valueRest] = this.globalSerializer.deserializeStream(keyRest, valueType)

            elements.push([key, value])
            rest = valueRest
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

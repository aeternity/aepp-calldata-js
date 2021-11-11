const FateTag = require('../FateTag.js')
const FateInt = require('../types/FateInt.js')
const FateList = require('../types/FateList.js')

class ListSerializer {
    constructor(globalSerializer) {
        this.globalSerializer = globalSerializer
    }
    serialize(list) {
        const serializedElements = list.items.map(e => {
            return this.globalSerializer.serialize(e)
        }).flat(Infinity)

        const len = list.items.length

        if (len < 16) {
            const prefix = (len << 4) | FateTag.SHORT_LIST

            return [
                prefix,
                ...serializedElements
            ]
        }

        return [
            FateTag.LONG_LIST,
            ...this.globalSerializer.serialize(new FateInt(len - 16)),
            ...serializedElements
        ]
    }
    deserialize(data, typeInfo) {
        const [value, rest] = this.deserializeStream(data, typeInfo)

        return value
    }
    deserializeStream(data, typeInfo) {
        const buffer = new Uint8Array(data)
        const prefix = buffer[0]
        let len = 0n
        let rest = buffer.slice(1)

        if (prefix === FateTag.LONG_LIST) {
            [len, rest] = this.globalSerializer.deserializeStream(buffer.slice(1))
            len += 16n
        }

        if ((prefix & 0x0F) === FateTag.SHORT_LIST) {
            len = BigInt((prefix & 0xF0) >> 4)
        }

        let elements = []
        let el = null
        let itemsType = undefined

        if (typeof typeInfo !== 'undefined') {
            itemsType = typeInfo.valuesType
        }

        for (let i = 0n; i < len; i++) {
            [el, rest] = this.globalSerializer.deserializeStream(rest, itemsType)
            elements.push(el)
        }

        if (len === 0n) {
            return [new FateList(null), rest]
        }

        if (typeof typeInfo === 'undefined') {
            itemsType = elements[0].type
        }

        return [
            new FateList(itemsType, elements),
            rest
        ]
    }
}

module.exports = ListSerializer

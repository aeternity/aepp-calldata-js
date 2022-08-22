const assert = require('./utils/assert')
const FateList = require('./types/FateList')
const FateTuple = require('./types/FateTuple')
const {FateTypeTuple, FateTypeInt} = require('./FateTypes')

/* eslint-disable no-use-before-define */

// TODO types comparator
const listComparator = (a, b) => {
    if (a.length === 0) {
        return -1
    }

    if (b.length === 0) {
        return 1
    }

    const cmp = FateComparator(a.itemsType)
    for (let i = 0; i < a.length; i++) {
        // second list is shorter but matches as prefix of the first one
        if (typeof b.items[i] === 'undefined') {
            return 1
        }

        // element difference
        const diff = cmp(a.items[i], b.items[i])
        if (diff !== 0) {
            return diff
        }
    }

    // if there is no early return from the loop above
    // then the first list match a prefix of the second

    // equal lists
    if (a.length === b.length) {
        return 0
    }

    // first list is shorter, thus smaller
    return -1
}

const tupleComparator = (a, b) => {
    if (a.size === 0) {
        return -1
    }

    const sizeDiff = a.size - b.size
    if (sizeDiff !== 0) {
        return sizeDiff
    }

    // equal size - compare elements
    for (let i = 0; i < a.size; i++) {
        const valTypeA = a.valueTypes[i]

        // TODO support different types ?

        const diff = FateComparator(valTypeA)(a.items[i], b.items[i])
        if (diff !== 0) {
            return diff
        }
    }

    // equal tuples
    return 0
}

const variantComparator = (a, b) => {
    const aDiff = a.arities.length - b.arities.length
    if (aDiff !== 0) {
        return aDiff
    }

    const aList = new FateList(a.aritiesType, a.arities)
    const bList = new FateList(b.aritiesType, b.arities)
    const aComparator = FateComparator(aList)

    const lDiff = aComparator(aList, bList)
    if (lDiff !== 0) {
        return lDiff
    }

    const tDiff = a.tag - b.tag
    if (tDiff !== 0) {
        return tDiff
    }

    // equal arities and tags - compare elements
    const elementsComparator = FateComparator(FateTypeTuple())

    return elementsComparator(
        new FateTuple(a.valueTypes, a.value),
        new FateTuple(b.valueTypes, b.value)
    )
}

const mapItemComparator = (type) => {
    const keyComparator = FateComparator(type)
    return (a, b) => keyComparator(a.key, b.key)
}

const mapComparator = (a, b) => {
    const aItems = [...a.items]
    const bItems = [...b.items]

    aItems.sort(mapItemComparator(a.keyType))
    bItems.sort(mapItemComparator(b.keyType))

    const keyComparator = FateComparator(a.keyType)
    const valueComparator = FateComparator(a.valueType)

    for (let i = 0; i < aItems.length; i++) {
        // second map is smaller (less items)
        if (typeof bItems[i] === 'undefined') {
            return 1
        }

        const aItem = aItems[i]
        const bItem = bItems[i]

        const kDiff = keyComparator(aItem.key, bItem.key)
        if (kDiff !== 0) {
            return kDiff
        }

        const vDiff = valueComparator(aItem.value, bItem.value)
        if (vDiff !== 0) {
            return vDiff
        }
    }

    // equal number of items
    if (aItems.length === bItems.length) {
        return 0
    }

    // first map item list is shorter, thus smaller
    return -1
}

const bytesComparator = (a, b) => {
    const aList = new FateList(FateTypeInt(), a.valueOf())
    const bList = new FateList(FateTypeInt(), b.valueOf())

    return listComparator(aList, bList)
}

const stringComparator = (a, b) => {
    const as = a.toString()
    const bs = b.toString()

    if (as.length === bs.length) {
        return as.localeCompare(bs)
    }

    return as.length - bs.length
}

const intComparator = (a, b) => Number(BigInt(a) - BigInt(b))
const boolComparator = (a, b) => a - b
const bitsComparator = (a, b) => {
    return (a < 0 || b < 0) ? -intComparator(a, b) : intComparator(a, b)
}

const comparators = {
    'int': intComparator,
    'bool': boolComparator,
    'string': stringComparator,
    'bits': bitsComparator,
    // composite types
    'list': listComparator,
    'tuple': tupleComparator,
    'variant': variantComparator,
    'map': mapComparator,
    // objects (bytes)
    'bytes': bytesComparator,
    'account_address': bytesComparator,
    'channel_address': bytesComparator,
    'contract_address': bytesComparator,
    'oracle_query_address': bytesComparator,
    'oracle_address': bytesComparator,
}

const FateComparator = (type) => {
    assert(type.hasOwnProperty('name'), `Cannot determine type name of ${JSON.stringify(type)}`)
    assert(comparators.hasOwnProperty(type.name), `Unsupported comparator for ${type.name}`)

    return comparators[type.name]
}

module.exports = FateComparator

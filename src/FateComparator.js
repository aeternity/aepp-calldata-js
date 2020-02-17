// TODO types comparator
const listComparator = (innerType) => {
    return (a, b) => {
        if (a.length === 0) {
            return -1
        }

        if (b.length === 0) {
            return 1
        }

        const cmp = FateComparator(innerType)
        for (let i = 0; i < a.length; i++) {

            // second list is shorter but matches as prefix of the first one
            if (typeof b[i] === 'undefined') {
                return 1
            }

            // element difference
            const diff = cmp(a[i], b[i])
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
}

const tupleComparator = (a, b) => {
    if (a.length === 0) {
        return -1
    }

    const sizeDiff = a.length - b.length
    if (sizeDiff !== 0) {
        return sizeDiff
    }

    // equal size - compare elements
    for (let i = 0; i < a.length; i++) {
        const [typeA, valA] = a[i]
        const [typeB, valB] = b[i]
        // TODO support different types ?
        console.assert(typeA === typeB)

        const diff = FateComparator(typeA)(valA, valB)
        if (diff != 0) {
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

    const aComparator = FateComparator('list')('int')
    const lDiff = aComparator(a.arities, b.arities)
    if (lDiff !== 0) {
        return lDiff
    }

    const tDiff = a.tag - b.tag
    if (tDiff !== 0) {
        return tDiff
    }

    // equal arities and tags - compare elements
    const tupleComparator = FateComparator('tuple')

    return tupleComparator(a.variantValues, b.variantValues)
}

const mapItemComparator = (type) => {
    const keyComparator = FateComparator(type)
    return (a, b) => keyComparator(a[0], b[0])
}

const mapComparator = (a, b) => {
    const [aKeyType, aValueType, itemsA] = a
    const [bKeyType, bValueType, itemsB] = b
    const aItems = [...itemsA]
    const bItems = [...itemsB]

    aItems.sort(mapItemComparator(aKeyType))
    bItems.sort(mapItemComparator(bKeyType))

    const keyComparator = FateComparator(aKeyType)
    const valueComparator = FateComparator(aValueType)

    for (let i = 0; i < aItems.length; i++) {
        // second map is smaller (less items)
        if (typeof bItems[i] === 'undefined') {
            return 1
        }

        const aItem = aItems[i]
        const bItem = bItems[i]

        const kDiff = keyComparator(aItem[0], bItem[0])
        if (kDiff !== 0) {
            return kDiff
        }

        const vDiff = valueComparator(aItem[1], bItem[1])
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

const comparators = {
    'int': (a, b) => Number(a - b),
    'bool': (a, b) => a - b,
    'string': (a, b) => a.localeCompare(b),
    'bits': (a, b) => (a < 0 || b < 0) ? -Number(a - b) : Number(a - b),
    // composite types
    'list': listComparator,
    'tuple': tupleComparator,
    'variant': variantComparator,
    'map': mapComparator,
    // objects (bytes)
    'address': (a, b) => Number(a - b),
    'bytes': (a, b) => Number(a - b),
    'channel': (a, b) => Number(a - b),
    'contract': (a, b) => Number(a - b),
    'oracle_query': (a, b) => Number(a - b),
    'oracle': (a, b) => Number(a - b),
}

const FateComparator = (type, innerType) => {
    if (!comparators.hasOwnProperty(type)) {
        throw new Error(`Unsupported comparator for ${type}`)
    }

    if (innerType) {
        return comparators[type](innerType)
    }

    return comparators[type]
}

module.exports = FateComparator

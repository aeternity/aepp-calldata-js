const bs58check = require('bs58check')

/**
 * Map the internal representation FATE data structure to Aesophia canonical structures and formats.
 */

class CanonicalMapper {
    visitData(acceptor) {
        return acceptor.valueOf()
    }

    visitAddress(acceptor) {
        return acceptor.prefix + '_' + bs58check.encode(acceptor.value)
    }

    visitList(acceptor) {
        return acceptor.items.map(e => e.accept(this))
    }

    visitMap(acceptor) {
        const map = new Map()
        for (const [key, value] of acceptor.iterator) {
            map.set(key.accept(this), value.accept(this))
        }

        return map
    }

    visitTuple(acceptor) {
        return acceptor.prepareItems(e => e.accept(this))
    }

    visitVariant(acceptor) {
        if (acceptor.variantName === 'None') {
            return undefined
        }

        const value = acceptor.value.map(e => e.accept(this))

        if (acceptor.variantName === 'Some') {
            return value[0]
        }

        return {
            [acceptor.variantName]: value
        }
    }
}

module.exports = CanonicalMapper
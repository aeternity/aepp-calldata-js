const ApiEncoder = require('../ApiEncoder')
const {MontBytes2Int} = require('../utils/Bls12381')
const {ByteArray2Hex} = require('../utils/Int2ByteArray')

/**
 * Map the internal representation FATE data structure to Aesophia canonical structures and formats.
 */

class CanonicalMapper {
    constructor() {
        this._apiEncoder = new ApiEncoder()
    }

    toCanonical(data) {
        return data.accept(this)
    }

    visitData(acceptor) {
        return acceptor.valueOf()
    }

    visitAddress(acceptor) {
        return this._apiEncoder.encode(acceptor.name, acceptor.value)
    }

    visitList(acceptor) {
        return acceptor.items.map(e => e.accept(this))
    }

    visitSet(acceptor) {
        return new Set(acceptor.items.map(e => e.accept(this)))
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
        const value = acceptor.value.map(e => e.accept(this))

        if (acceptor.variantName === 'None') {
            return undefined
        }

        if (acceptor.variantName === 'Some') {
            return value[0]
        }

        return {
            [acceptor.variantName]: value
        }
    }

    visitBls12381Fr(acceptor) {
        return MontBytes2Int(acceptor.valueOf(), 'r')
    }

    visitBls12381Fp(acceptor) {
        return MontBytes2Int(acceptor.valueOf(), 'p')
    }

    visitCalldata(acceptor) {
        const {functionId, args} = acceptor.valueOf()

        return {
            functionId: ByteArray2Hex(functionId),
            args: args.map(e => e.accept(this))
        }
    }
}

module.exports = CanonicalMapper

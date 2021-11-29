const FateData = require('./FateData')
const {FateTypeVariant, FateTypeTuple, FateTypeInt} = require('../FateTypes')

class FateVariant extends FateData {
    constructor(arities, tag, value = [], valueTypes = [], variants = []) {
        super('variant')

        this.arities = Array.from(arities)
        this._tag = tag

        this._value = value
        this._valueTypes = valueTypes

        this._type = FateTypeVariant(arities, valueTypes, variants)
    }

    get valueTypes() {
        return this._valueTypes
    }

    get type() {
        return this._type
    }

    get tag() {
        return this._tag
    }

    get value() {
        return this._value
    }

    get aritiesType() {
        return FateTypeInt()
    }

    get variantType() {
        return FateTypeTuple(this._valueTypes)
    }

    get variants() {
        return this._type.variants
    }

    get variantName() {
        const variant = this.variants[this.tag]

        return Object.keys(variant)[0]
    }

    valueOf() {
        if (this.variants.length === 0) {
            return this
        }

        const value = this._value.map(e => e.valueOf())

        return {
            [this.variantName]: value
        }
    }

    accept(visitor) {
        return visitor.visitVariant(this)
    }
}

module.exports = FateVariant

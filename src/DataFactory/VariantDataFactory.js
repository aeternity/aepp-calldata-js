const FateVariant = require('../types/FateVariant')
const FateTypeError = require('../Errors/FateTypeError')
const BaseDataFactory = require('./BaseDataFactory')

const TYPES = [
    'variant',
    'Chain.ttl',
    'AENS.pointee',
    'AENS.name'
]

class VariantDataFactory extends BaseDataFactory {
    supports({ name, _valueTypes }) {
        return TYPES.includes(name)
    }

    create(type, value) {
        const canonicalValue = this.getVariantValue(type, value)

        if (!this.isValid(canonicalValue)) {
            throw new FateTypeError(
                type.name,
                `Variant should be an object mapping constructor to array of values, got "${value}" instead`
            )
        }

        const [variantCtor, variantArgs] = Object.entries(canonicalValue)[0]

        const arities = type.variants.map(e => {
            const [[, args]] = Object.entries(e)
            return args.length
        })

        const tag = type.variants.findIndex(e => {
            const [[key, _]] = Object.entries(e)
            return key === variantCtor
        })

        if (tag === -1) {
            throw new FateTypeError(
                type.name,
                `Unknown variant constructor: ${variantCtor}`
            )
        }

        const [[, variantTypes]] = Object.entries(type.variants[tag])

        if (variantArgs.length !== variantTypes.length) {
            throw new FateTypeError(
                type.name,
                `"${variantCtor}" variant constructor expects ${variantTypes.length} argument(s) but got ${variantArgs.length} instead`
            )
        }

        const variantValue = this.valueFactory.create(variantTypes, variantArgs)

        return new FateVariant(arities, tag, variantValue, variantTypes, type.variants)
    }

    getVariantValue(type, value) {
        if (!this.isOptionVariant(type)) {
            return value
        }

        if ([undefined, null].includes(value)) {
            return {None: []}
        }

        const [variantName] = Object.keys(value)
        if (['Some', 'None'].includes(variantName)) {
            return value
        }

        return {Some: [value]}
    }

    isValid(value) {
        return typeof value === 'object'
            && value !== null
            && Object.entries(value).length === 1
            && Array.isArray(Object.values(value)[0])
    }

    isOptionVariant({ _name, variants }) {
        return variants.some(({ None }) => None && None.length === 0)
            && variants.some(({ Some }) => Some)
    }
}

module.exports = VariantDataFactory

const TypeResolveError = require('./Errors/TypeResolveError')
const {
    FateTypeVoid,
    FateTypeInt,
    FateTypeBool,
    FateTypeString,
    FateTypeBits,
    FateTypeBytes,
    FateTypeHash,
    FateTypeSignature,
    FateTypeAccountAddress,
    FateTypeContractAddress,
    FateTypeOracleAddress,
    FateTypeOracleQueryAddress,
    FateTypeList,
    FateTypeMap,
    FateTypeTuple,
    FateTypeRecord,
    FateTypeSet,
    FateTypeVariant,
    FateTypeOption,
    FateTypeChainTTL,
    FateTypeChainGAMetaTx,
    FateTypeChainPayingForTx,
    FateTypeChainBaseTx,
    FateTypeAENSPointee,
    FateTypeAENSName,
    FateTypeBls12381Fr,
    FateTypeBls12381Fp
} = require('./FateTypes')

const isObject = (value) => {
    return value && typeof value === 'object' && value.constructor === Object
}

class TypeResolver {
    isCustomType() {
        return false
    }

    resolveTypeDef(type, valueTypes) {
        return [type, valueTypes]
    }

    resolveValueTypes(valueTypes, vars) {
        if (!Array.isArray(valueTypes)) {
            return []
        }

        return valueTypes.map(v => {
            const tpl = v.hasOwnProperty('type') ? v.type : v
            const t = vars.hasOwnProperty(tpl) ? vars[tpl] : tpl

            return this.resolveType(t, vars)
        })
    }

    resolveType(type, vars = {}) {
        let key = type
        let valueTypes = []
        let resolvedTypes = []

        if (isObject(type)) {
            [[key, valueTypes]] = Object.entries(type)
        }

        if (this.isCustomType(key)) {
            const [typeDef, typeVars] = this.resolveTypeDef(key, valueTypes)

            return this.resolveType(typeDef, typeVars)
        }

        // variant value types are resolved in its own method
        if (key !== 'variant') {
            resolvedTypes = this.resolveValueTypes(valueTypes, vars)
        }

        if (key === 'void') {
            return FateTypeVoid()
        }

        if (key === 'unit') {
            return FateTypeTuple([])
        }

        if (key === 'int') {
            return FateTypeInt()
        }

        if (key === 'bool') {
            return FateTypeBool()
        }

        if (key === 'string') {
            return FateTypeString()
        }

        if (key === 'bits') {
            return FateTypeBits()
        }

        if (key === 'hash') {
            return FateTypeHash()
        }

        if (key === 'signature') {
            return FateTypeSignature()
        }

        if (key === 'address') {
            return FateTypeAccountAddress()
        }

        if (key === 'contract_pubkey') {
            return FateTypeContractAddress()
        }

        if (key === 'Chain.ttl') {
            return FateTypeChainTTL()
        }

        if (key === 'Chain.ga_meta_tx') {
            return FateTypeChainGAMetaTx()
        }

        if (key === 'Chain.paying_for_tx') {
            return FateTypeChainPayingForTx()
        }

        if (key === 'Chain.base_tx') {
            return FateTypeChainBaseTx()
        }

        if (key === 'AENS.pointee') {
            return FateTypeAENSPointee()
        }

        if (key === 'AENS.name') {
            return FateTypeAENSName()
        }

        if (key === 'Set.set') {
            return FateTypeSet(...resolvedTypes)
        }

        if (key === 'MCL_BLS12_381.fr') {
            return FateTypeBls12381Fr()
        }

        if (key === 'MCL_BLS12_381.fp') {
            return FateTypeBls12381Fp()
        }

        if (key === 'bytes') {
            return FateTypeBytes(valueTypes)
        }

        if (key === 'list') {
            return FateTypeList(...resolvedTypes)
        }

        if (key === 'map') {
            return FateTypeMap(...resolvedTypes)
        }

        // Unbox singleton tuples and records
        // https://github.com/aeternity/aesophia/pull/205
        // https://github.com/aeternity/aesophia/commit/a403a9d227ac56266cf5bb8fbc916f17e6141d15
        if ((key === 'tuple' || key === 'record') && resolvedTypes.length === 1) {
            return resolvedTypes[0]
        }

        if (key === 'tuple') {
            return FateTypeTuple(resolvedTypes)
        }

        if (key === 'record') {
            const keys = valueTypes.map(e => e.name)

            return FateTypeRecord(keys, resolvedTypes)
        }

        if (key === 'variant') {
            return this.resolveVariant(valueTypes, vars)
        }

        if (key === 'option') {
            return FateTypeOption(resolvedTypes)
        }

        if (key === 'oracle') {
            return FateTypeOracleAddress(...resolvedTypes)
        }

        if (key === 'oracle_query') {
            return FateTypeOracleQueryAddress(...resolvedTypes)
        }

        throw new TypeResolveError('Cannot resolve type: ' + JSON.stringify(type))
    }

    resolveVariant(valueTypes, vars) {
        const variants = valueTypes.map(e => {
            const [[variant, args]] = Object.entries(e)
            const resolvedArgs = args.map(v => {
                const t = vars.hasOwnProperty(v) ? vars[v] : v
                return this.resolveType(t, vars)
            })

            return {[variant]: resolvedArgs}
        })

        return FateTypeVariant(variants)
    }
}

module.exports = TypeResolver

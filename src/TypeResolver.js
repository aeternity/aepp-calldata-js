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
    FateTypeEvent,
    FateTypeBls12381Fr,
    FateTypeBls12381Fp
} = require('./FateTypes')

const isObject = (value) => {
    return value && typeof value === 'object' && value.constructor === Object
}

const isOption = ({type}) => {
    let key = type
    let _
    if (isObject(key)) {
        [[key, _]] = Object.entries(key)
    }

    return key === 'option'
}

class TypeResolver {
    constructor(aci) {
        this.aci = aci
    }

    getCallTypes(contract, funName) {
        const funcAci = this.getNamespaceAci(contract).functions.find(e => e.name === funName)

        if (funcAci) {
            const types = funcAci.arguments.map(e => this.resolveType(e.type))
            const options = funcAci.arguments.filter(isOption)
            return {
                types,
                required: types.length - options.length,
            }
        }

        if (funName === 'init') {
            return {types: [], required: 0}
        }

        throw new TypeResolveError(`Unknown function ${funName}`)
    }

    getReturnType(contract, funName) {
        if (funName === 'init') {
            return this.resolveType('void')
        }

        const funcAci = this.getNamespaceAci(contract).functions.find(e => e.name === funName)

        if (!funcAci) {
            throw new TypeResolveError(`Unknown function ${funName}`)
        }

        return this.resolveType(funcAci.returns)
    }

    getEventType(contract) {
        const aci = this.getNamespaceAci(contract)

        if (!aci.hasOwnProperty('event')) {
            throw new TypeResolveError('Missing event declaration')
        }

        return FateTypeEvent(this.resolveType(aci.event))
    }

    isCustomType(type) {
        if (typeof type !== 'string') {
            return false
        }

        if (this.isStdType(type)) {
            return false
        }

        const [namespace, _localType] = type.split('.')
        const namespaceData = this.getNamespaceAci(namespace)

        return !!namespaceData
    }

    isStdType(type) {
        if (type === 'Set.set') {
            return true
        }

        return false
    }

    getNamespaceAci(name) {
        for (const e of this.aci) {
            const [[_type, data]] = Object.entries(e)
            if (data.name === name) {
                return data
            }
        }

        return null
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

        if (Array.isArray(valueTypes)) {
            if (key !== 'variant') {
                resolvedTypes = valueTypes.map(v => {
                    const tpl = v.hasOwnProperty('type') ? v.type : v
                    const t = vars.hasOwnProperty(tpl) ? vars[tpl] : tpl

                    return this.resolveType(t, vars)
                })
            }
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

        if (key === 'contract_address') {
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

        // TODO: junk first 2 args for BC
        return FateTypeVariant(0, null, variants)
    }

    resolveTypeDef(type, params = []) {
        const [namespace, localType] = type.split('.')
        const namespaceData = this.getNamespaceAci(namespace)

        // not a custom type
        if (!namespaceData) {
            throw new TypeResolveError('Unknown namespace for ' + JSON.stringify(type))
        }

        if (namespaceData.name === type) {
            return ['contract_address', []]
        }

        const def = [
            ...namespaceData.type_defs,
            ...namespaceData.state ? [{
                name: 'state',
                typedef: namespaceData.state,
                vars: []
            }] : []
        ].find(e => e.name === localType)

        if (!def) {
            throw new TypeResolveError('Unknown type definition: ' + JSON.stringify(type))
        }

        const vars = {}
        def.vars.forEach((e, i) => {
            const [[_, k]] = Object.entries(e)
            vars[k] = params[i]
        })

        const typeDef = vars.hasOwnProperty(def.typedef) ? vars[def.typedef] : def.typedef

        return [typeDef, vars]
    }
}

module.exports = TypeResolver

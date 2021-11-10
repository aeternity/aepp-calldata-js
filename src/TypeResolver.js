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
    FateTypeVariant,
    FateTypeOption,
    FateTypeChainTTL,
    FateTypeChainGAMetaTx,
    FateTypeChainPayingForTx,
    FateTypeChainBaseTx,
    FateTypeAENSPointee,
    FateTypeAENSName,
} = require('./FateTypes.js')

const isObject = (value) => {
    return value && typeof value === 'object' && value.constructor === Object;
}

class TypeResolver {
    constructor(aci) {
        this.aci = aci
    }

    getCallTypes(contract, funName) {
        const funcAci = this.getNamespaceAci(contract).functions.find(e => e.name === funName)

        if (funcAci) {
            return funcAci.arguments.map(e => this.resolveType(e.type))
        }

        if (funName === 'init') {
            return []
        }

        throw new Error(`Unknown function ${funName}`)
    }

    getReturnType(contract, funName) {
        if (funName === 'init') {
            return this.resolveType('void')
        }

        const funcAci = this.getNamespaceAci(contract).functions.find(e => e.name === funName)

        if (!funcAci) {
            throw new Error(`Unknown function ${funName}`)
        }

        return this.resolveType(funcAci.returns)
    }

    isCustomType(type) {
        if (typeof type !== 'string') {
            return false
        }

        const [namespace, localType] = type.split('.')
        const namespaceData = this.getNamespaceAci(namespace)

        return !!namespaceData
    }

    getNamespaceAci(name) {
        for (const e of this.aci) {
            const [[type, data]] = Object.entries(e)
            if (data.name === name) {
                return data
            }
        }
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
            if (key !== 'record' && key !== 'variant') {
                resolvedTypes = valueTypes.map(t => this.resolveType(t))
            }
        }

        if (key === 'void') {
            return FateTypeVoid()
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

        if (key === 'bytes') {
            return FateTypeBytes(valueTypes)
        }

        if (key === 'list') {
            return FateTypeList(...resolvedTypes)
        }

        if (key === 'tuple') {
            return FateTypeTuple(resolvedTypes)
        }

        if (key === 'map') {
            return FateTypeMap(...resolvedTypes)
        }

        if (key === 'record') {
            return this.resolveRecord(valueTypes)
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

        throw new Error('Cannot resolve type: ' + JSON.stringify(type))
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

        // junk first 2 args for BC
        return FateTypeVariant(0, null, variants)
    }

    resolveRecord(valueTypes) {
        const keys = valueTypes.map(e => e.name)
        const resolvedTypes = valueTypes.map(e => this.resolveType(e.type))

        return FateTypeRecord(keys, resolvedTypes)
    }

    resolveTypeDef(type, params = []) {
        const [namespace, localType] = type.split('.')
        const namespaceData = this.getNamespaceAci(namespace)

        // not a custom type
        if (!namespaceData) {
            throw new Error('Unknown namespace for ' + JSON.stringify(type))
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
        ].find(e => e.name === localType);

        if (!def) {
            throw new Error('Unknown type definition: ' + JSON.stringify(type))
        }

        let vars = {}
        def.vars.forEach((e, i) => {
            const [[,k]] = Object.entries(e)
            vars[k] = params[i]
        })

        const typeDef = vars.hasOwnProperty(def.typedef) ? vars[def.typedef] : def.typedef

        return [typeDef, vars]
    }
}

module.exports = TypeResolver

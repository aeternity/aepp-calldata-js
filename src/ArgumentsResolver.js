const FateInt = require('./types/FateInt.js')
const FateBool = require('./types/FateBool.js')
const FateString = require('./types/FateString.js')
const FateHash = require('./types/FateHash.js')
const FateList = require('./types/FateList.js')
const FateMap = require('./types/FateMap.js')
const FateTuple = require('./types/FateTuple.js')
const FateVariant = require('./types/FateVariant.js')
const FateBytes = require('./types/FateBytes.js')
const FateBits = require('./types/FateBits.js')
const FateAccountAddress = require('./types/FateAccountAddress.js')
const FateContractAddress = require('./types/FateContractAddress.js')
const FateOracleAddress = require('./types/FateOracleAddress.js')
const FateOracleQueryAddress = require('./types/FateOracleQueryAddress.js')

const zip = (arr, ...arrs) => {
  return arr.map((val, i) => arrs.reduce((a, arr) => [...a, arr[i]], [val]));
}

const isObject = (value) => {
    return value && typeof value === 'object' && value.constructor === Object;
}

ArgumentsResolver = function (aci) {
    this.aci = aci
}

ArgumentsResolver.prototype = {
    resolveFuncationCall(contract, funName, args) {
        const argTypes = this.getArgumentTypes(contract, funName)

        return this.resolveArguments(argTypes, args)
    },

    resolveArguments(argTypes, args) {
        if (argTypes.length !== args.length) {
            throw new Error(
                `Non matching number of arguments.
                Got ${args.length} but expected ${argTypes.length}`
            )
        }

        return zip(argTypes, args).map(el => this.resolveArgument(...el))
    },

    getArgumentTypes(contract, funName) {
        const funcAci = this.getNamespaceAci(contract).functions.find(e => e.name == funName)

        if (funcAci) {
            return funcAci.arguments.map(e => e.type)
        }

        if (funName === 'init') {
            return []
        }

        throw new Error(`Unknown function ${funName}`)
    },

    getNamespaceAci(name) {
        for (const e of this.aci) {
            const [[type, data]] = Object.entries(e)
            if (data.name === name) {
                return data
            }
        }

        throw new Error(`Unknown namespace ${name}`)
    },

    resolveArgument(type, value, vars = {}) {
        if (type === 'int') {
            return new FateInt(value)
        }

        if (type === 'bool') {
            return new FateBool(value)
        }

        if (type === 'string') {
            return new FateString(value)
        }

        if (type === 'bits') {
            return new FateBits(value)
        }

        if (type === 'hash') {
            return new FateHash(value)
        }

        if (type === 'address') {
            return new FateAccountAddress(value)
        }

        if (type === 'contract_address') {
            return new FateContractAddress(value)
        }

        // typedefs, non-primitives
        if (typeof type === 'string') {
            return this.resolveTypeDef(type, value, vars)
        }

        // composite types
        if (isObject(type)) {
            return this.resolveObjectArgument(type, value, vars)
        }

        throw new Error('Cannot resolve type: ' + JSON.stringify(type))
    },

    resolveTypeDef(type, value, params = []) {
        const [namespace, localType] = type.split('.')
        const namespaceData = this.getNamespaceAci(namespace)

        if (namespaceData.name === type) {
            return this.resolveArgument('contract_address', value)
        }

        const def = namespaceData.type_defs.find(e => e.name == localType);

        if (!def) {
            throw new Error('Unknown type definition: ' + JSON.stringify(type))
        }

        let vars = {}
        def.vars.forEach((e, i) => {
            const [[,k]] = Object.entries(e)
            vars[k] = params[i]
        })

        const typedef = vars.hasOwnProperty(def.typedef) ? vars[def.typedef] : def.typedef

        return this.resolveArgument(typedef, value, vars)
    },

    resolveObjectArgument(type, value, vars = {}) {
        const key = Object.keys(type)[0]
        let valueTypes = type[key]

        if (Array.isArray(valueTypes)) {
            valueTypes = valueTypes.map(e => vars.hasOwnProperty(e) ? vars[e] : e)
        }

        if (key === 'bytes') {
            return new FateBytes(value, valueTypes)
        }

        if (key === 'oracle') {
            return new FateOracleAddress(value, valueTypes)
        }

        if (key === 'oracle_query') {
            return new FateOracleQueryAddress(value, valueTypes)
        }

        if (key === 'list') {
            const resolvedArgs = value.map(v => this.resolveArgument(valueTypes[0], v))
            const resolvedType = resolvedArgs[0].type

            return new FateList(resolvedType, resolvedArgs)
        }

        if (key === 'map') {
            const [keyType, valueType] = valueTypes
            const resolvedArgs = value.map(item => {
                return [
                    this.resolveArgument(keyType, item[0]),
                    this.resolveArgument(valueType, item[1]),
                ]
            })

            const [[firstKey, firstValue]] = resolvedArgs

            return new FateMap(firstKey.type, firstValue.type, resolvedArgs)
        }

        if (key === 'record') {
            const resolvedArgs = valueTypes.map(e => this.resolveArgument(e.type, value[e.name]))
            const resolvedTypes = resolvedArgs.map(e => e.type)

            return new FateTuple(resolvedTypes, resolvedArgs)
        }

        if (key === 'tuple') {
            const resolvedArgs = valueTypes.map((t, i) => this.resolveArgument(t, value[i]))
            const resolvedTypes = resolvedArgs.map(e => e.type)

            return new FateTuple(resolvedTypes, resolvedArgs)
        }

        if (key === 'variant') {
            return this.resolveVariantArgument(valueTypes, value, vars)
        }

        if (key === 'option') {
            const optionTypes = [{ None: []}, { Some: valueTypes }]
            return this.resolveVariantArgument(optionTypes, value, vars)
        }

        // typedefs
        if (typeof key === 'string') {
            return this.resolveTypeDef(key, value, valueTypes)
        }

        throw new Error('Cannot resolve object type: ' + JSON.stringify(key))
    },

    resolveVariantArgument(valueTypes, value, vars = {}) {
        const arities = valueTypes.map(e => {
            const [[, args]] = Object.entries(e)
            return args.length
        })

        const tag = valueTypes.findIndex(e => {
            const [[key,]] = Object.entries(e)
            return key === value.variant
        })

        if (tag === -1) {
            throw new Error('Unknown variant: ' + JSON.stringify(value.variant))
        }

        const [[, argsTemplate]] = Object.entries(valueTypes[tag])
        const variantArgs = argsTemplate.map(e => vars.hasOwnProperty(e) ? vars[e] : e)
        const resolvedArgs = this.resolveArguments(variantArgs, value.values)
        const resolvedTypes = resolvedArgs.map(e => e.type)

        return new FateVariant(arities, tag, resolvedArgs, resolvedTypes)
    },
}

module.exports = ArgumentsResolver

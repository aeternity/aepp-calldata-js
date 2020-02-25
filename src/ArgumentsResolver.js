const FateInt = require('./types/FateInt.js')
const FateBool = require('./types/FateBool.js')
const FateString = require('./types/FateString.js')
const FateList = require('./types/FateList.js')
const FateMap = require('./types/FateMap.js')
const FateTuple = require('./types/FateTuple.js')
const FateVariant = require('./types/FateVariant.js')
const FateBytes = require('./types/FateBytes.js')

const zip = (arr, ...arrs) => {
  return arr.map((val, i) => arrs.reduce((a, arr) => [...a, arr[i]], [val]));
}

const isObject = (value) => {
    return value && typeof value === 'object' && value.constructor === Object;
}

const unzipArgs = (args) => {
    return [
        args.map(e => Array.isArray(e) ? e[1] : e.type),
        args.map(e => Array.isArray(e) ? e[2] : e)
    ]
}

ArgumentsResolver = function (aci) {
    this.aci = aci
}

ArgumentsResolver.prototype = {
    resolveArguments(argTypes, args) {
        if (argTypes.length !== args.length) {
            throw new Error(
                `Non matching number of arguments.
                Got ${args.length} but expected ${argTypes.length}`
            )
        }

        return zip(argTypes, args).map(el => this.resolveArgument(...el))
    },

    resolveArgument(type, value) {
        if (type === 'int') {
            return new FateInt(value)
        }

        if (type === 'bool') {
            return new FateBool(value)
        }

        if (type === 'string') {
            return new FateString(value)
        }

        // typedefs, non-primitives
        if (typeof type === 'string') {
            const [contractName, localType] = type.split('.')
            const def = this.aci.type_defs.find(e => e.name == localType);

            if (!def) {
                throw new Error('Unknown type definition: ' + type)
            }

            return this.resolveArgument(def.typedef, value)
        }

        // composite types
        if (isObject(type)) {
            return this.resolveObjectArgument(type, value)
        }

        throw new Error('Cannot resolve type: ' + JSON.stringify(type))
    },

    resolveObjectArgument(type, value) {
        const key = Object.keys(type)[0]
        const valueTypes = type[key]

        if (key === 'bytes') {
            return new FateBytes(value, valueTypes)
        }

        if (key === 'list') {
            const resolvedArgs = value.map(v => this.resolveArgument(valueTypes[0], v))
            const [resolvedTypes, resolvedValues] = unzipArgs(resolvedArgs)

            return new FateList(resolvedTypes[0], resolvedValues)
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
            const [tupleTypes, tupleValues] = unzipArgs(resolvedArgs)

            return new FateTuple(tupleTypes, tupleValues)
        }

        if (key === 'tuple') {
            const resolvedArgs = valueTypes.map((t, i) => this.resolveArgument(t, value[i]))
            const [tupleTypes, tupleValues] = unzipArgs(resolvedArgs)

            return new FateTuple(tupleTypes, tupleValues)
        }

        if (key === 'variant') {
            return this.resolveVariantArgument(valueTypes, value)
        }

        throw new Error('Cannot resolve object type: ' + JSON.stringify(key))
    },

    resolveVariantArgument(valueTypes, value) {
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

        const [[, variantArgs]] = Object.entries(valueTypes[tag])
        const resolvedArgs = this.resolveArguments(variantArgs, value.values)
        const [variantValueTypes, variantValues] = unzipArgs(resolvedArgs)

        return new FateVariant(arities, tag, variantValues, variantValueTypes)
    },
}

module.exports = ArgumentsResolver

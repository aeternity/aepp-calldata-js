const {
    PRIMITIVE_TYPES,
    FateType,
    FateTypeVariant,
} = require('./FateTypes.js')

const FateList = require('./types/FateList.js')
const FateMap = require('./types/FateMap.js')
const FateTuple = require('./types/FateTuple.js')
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
        if (PRIMITIVE_TYPES.includes(type)) {
            return [type, FateType(type), value]
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
            return new FateList(valueTypes[0], value)
        }

        if (key === 'map') {
            return new FateMap(...valueTypes, value)
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
            const variantType = FateTypeVariant(arities, variantValueTypes)

            return [
                'variant',
                variantType,
                {tag, variantValues: value.values}
            ]
    },
}

module.exports = ArgumentsResolver
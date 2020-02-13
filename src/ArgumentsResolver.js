const PRIMITIVE_TYPES = ['bool', 'int', 'string']

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
    resolveArguments(funName, args) {
        const argAci = this.getArgumentsAci(funName)

        if (argAci.length !== args.length) {
            throw new Error(
                `Non matching number of arguments to function call of ${funName}.
                Got ${args.length} but expected ${argAci.length}`
            )
        }

        let resolvedArgs = []
        for (let i = 0; i < argAci.length; i++) {
            resolvedArgs.push(
                this.resolveArgument(argAci[i].type, args[i])
            )
        }

        return resolvedArgs
    },

    resolveArgument(type, value) {
        if (PRIMITIVE_TYPES.includes(type)) {
            return [type, value]
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
            return [key, value]
        }

        if (key === 'list') {
            return [key, valueTypes[0], value]
        }

        if (key === 'map') {
            return [key, [...valueTypes, value]]
        }

        if (key === 'record') {
            const tupleValues = valueTypes.map(valueType => {
                return this.resolveArgument(valueType.type, value[valueType.name])
            })

            return ['tuple', tupleValues]
        }

        // tuple
        if (key === 'tuple') {
            const values = this.resolveArgumentValues(valueTypes, value)

            return [key, values]
        }

        if (key === 'variant') {
            return this.resolveVariantArgument(valueTypes, value)
        }

        throw new Error('Cannot resolve object type: ' + JSON.stringify(key))
    },

    resolveVariantArgument(valueTypes, value) {
            let arities = []
            let tag = -1
            let resolvedArgs = []

            for (let i = 0; i < valueTypes.length; i++) {
                const variant = valueTypes[i]
                const variantKey = Object.keys(variant)[0]
                const variantArgs = variant[variantKey]

                arities.push(variantArgs.length)

                if (variantKey == value.variant) {
                    resolvedArgs = this.resolveArgumentValues(variantArgs, value.values)
                    tag = i
                }
            }

            if (tag === -1) {
                throw new Error('Unknown variant: ' + JSON.stringify(value.variant))
            }

            return [
                'variant',
                {arities, tag, variantValues: resolvedArgs}
            ]
    },

    resolveArgumentValues(args, values) {
        if (args.length != values.length) {
            throw new Error('Non matching argument values: ' + JSON.stringify(args) + JSON.stringify(values))
        }

        return zip(args, values).map(el => this.resolveArgument(...el))
    },

    getArgumentsAci(funName) {
        const funcAci = this.aci.functions.find(e => e.name == funName)

        if (funcAci) {
            return funcAci.arguments
        }

        if (funName === 'init') {
            return []
        }

        throw new Error('Unknown function: ' + funName)
    }
}

module.exports = ArgumentsResolver

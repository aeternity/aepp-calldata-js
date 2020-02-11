const fs = require('fs')
const blake = require('blakejs')
const base64check = require('base64check')
const Serializer = require('./Serializer.js')

const HASH_BYTES = 32
const serializer = Object.create(Serializer)
const PRIMITIVE_TYPES = ['bool', 'int', 'string']

const zip = (arr, ...arrs) => {
  return arr.map((val, i) => arrs.reduce((a, arr) => [...a, arr[i]], [val]));
}

const isObject = (value) => {
    return value && typeof value === 'object' && value.constructor === Object;
}

Encoder = function (aci) {
    this.aci = aci
}

Encoder.prototype = {
    encode: function (funcName, args) {
        return 'cb_' + base64check.encode(this.serialize(funcName, args))
    },

    serialize: function (funName, args) {
        const functionId = this.symbolIdentifier(funName)
        const resolvedArgs = this.resolveArguments(funName, args)

        const calldata = ['tuple', [
                ['byte_array', functionId],
                ['tuple', resolvedArgs]
        ]]

        const serialized = serializer.serialize(calldata)

        return new Uint8Array(serialized.flat(Infinity))
    },

    resolveArguments: function (funName, args) {
        const funcAci = this.aci.functions.find(e => e.name == funName)
        const argAci = (funcAci) ? funcAci.arguments : []

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
                    key,
                    {arities, tag, variantValues: resolvedArgs}
                ]
            }
        }

        throw new Error('Cannot resolve type: ' + JSON.stringify(type))
    },

    resolveArgumentValues(args, values) {
        if (args.length != values.length) {
            throw new Error('Non matching argument values: ' + JSON.stringify(args) + JSON.stringify(values))
        }

        return zip(args, values).map(el => {
            const [t, v] = el
            return this.resolveArgument(t, v)
        })
    },

    symbolIdentifier: function (funName) {
        // First 4 bytes of 32 bytes blake hash
        hash = Array.from(blake.blake2b(funName, null, HASH_BYTES))

        return hash.slice(0, 4)
    }
}

module.exports = Encoder

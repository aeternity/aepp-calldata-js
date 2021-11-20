const FateInt = require('./types/FateInt')
const FateBool = require('./types/FateBool')
const FateString = require('./types/FateString')
const FateHash = require('./types/FateHash')
const FateSignature = require('./types/FateSignature')
const FateList = require('./types/FateList')
const FateMap = require('./types/FateMap')
const FateTuple = require('./types/FateTuple')
const FateVariant = require('./types/FateVariant')
const FateBytes = require('./types/FateBytes')
const FateBits = require('./types/FateBits')
const FateAccountAddress = require('./types/FateAccountAddress')
const FateContractAddress = require('./types/FateContractAddress')
const FateChannelAddress = require('./types/FateChannelAddress')
const FateOracleAddress = require('./types/FateOracleAddress')
const FateOracleQueryAddress = require('./types/FateOracleQueryAddress')

const zip = (arr, ...arrs) => {
    return arr.map((val, i) => arrs.reduce((a, curr) => [...a, curr[i]], [val]))
}

class DataFactory {
    constructor(aci) {
        this.aci = aci
    }

    create(types, values) {
        if (types.length !== values.length) {
            throw new Error(
                `Non matching number of arguments. Got ${values.length} but expected ${types.length}`
            )
        }

        return zip(types, values).map(el => this.createData(...el))
    }

    createData(type, value) {
        if (type.name === 'int') {
            return new FateInt(value)
        }

        if (type.name === 'bool') {
            return new FateBool(value)
        }

        if (type.name === 'string') {
            return new FateString(value)
        }

        if (type.name === 'bits') {
            return new FateBits(value)
        }

        if (type.name === 'hash') {
            return new FateHash(value)
        }

        if (type.name === 'signature') {
            return new FateSignature(value)
        }

        if (type.name === 'account_address') {
            return new FateAccountAddress(value)
        }

        if (type.name === 'contract_address') {
            return new FateContractAddress(value)
        }

        if (type.name === 'channel_address') {
            return new FateChannelAddress(value)
        }

        if (type.name === 'bytes') {
            return new FateBytes(value, type.valueTypes)
        }

        if (type.name === 'oracle_address') {
            return new FateOracleAddress(value, type.valueTypes)
        }

        if (type.name === 'oracle_query_address') {
            return new FateOracleQueryAddress(value, type.valueTypes)
        }

        if (type.name === 'list') {
            const resolvedValues = value.map(v => this.createData(type.valuesType, v))

            return new FateList(type.valuesType, resolvedValues)
        }

        if (type.name === 'map') {
            const resolvedValues = []
            for (const item of value) {
                resolvedValues.push([
                    this.createData(type.keyType, item[0]),
                    this.createData(type.valueType, item[1]),
                ])
            }

            return new FateMap(type.keyType, type.valueType, resolvedValues)
        }

        if (type.name === 'tuple') {
            const resolvedValue = type.valueTypes.map((t, i) => {
                return this.createData(t, value[i])
            })

            return new FateTuple(type.valueTypes, resolvedValue)
        }

        if (type.name === 'record') {
            const resolvedValue = type.valueTypes.map((t, i) => {
                const key = type.keys[i]
                return this.createData(t, value[key])
            })

            return new FateTuple(type.valueTypes, resolvedValue)
        }

        if (['variant', 'Chain.ttl', 'AENS.pointee', 'AENS.name'].includes(type.name)) {
            return this.createVariant(type, value)
        }

        throw new Error('Unsupported type: ' + JSON.stringify(type))
    }

    createVariant(type, value) {
        const variantCtor = Object.keys(value)[0]
        const variantArgs = value[variantCtor]

        const arities = type.variants.map(e => {
            const [[, args]] = Object.entries(e)
            return args.length
        })

        const tag = type.variants.findIndex(e => {
            const [[key, _]] = Object.entries(e)
            return key === variantCtor
        })

        if (tag === -1) {
            throw new Error('Unknown variant: ' + JSON.stringify(value))
        }

        const [[, variantTypes]] = Object.entries(type.variants[tag])
        const variantValue = this.create(variantTypes, variantArgs)

        return new FateVariant(arities, tag, variantValue, variantTypes)
    }
}

module.exports = DataFactory

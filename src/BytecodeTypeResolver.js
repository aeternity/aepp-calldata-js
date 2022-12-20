const ContractEncoder = require('./ContractEncoder')
const TypeResolveError = require('./Errors/TypeResolveError')
const {
    FateTypeEvent,
    FateTypeVariant,
} = require('./FateTypes')

class BytecodeTypeResolver {
    constructor(encodedContract) {
        this._contractEncoder = new ContractEncoder()
        this._encodedContract = encodedContract
        this._contract = null
    }

    get _bytecode() {
        if (this._contract === null) {
            this._contract = this._contractEncoder.decode(this._encodedContract)
        }

        return this._contract.bytecode
    }

    getFunctionId(funName) {
        const {symbols} = this._bytecode

        return Object.keys(symbols).find(key => symbols[key] === funName)
    }

    getFunction(id) {
        const {functions} = this._bytecode

        return functions.find(f => f.id === id)
    }

    getFunctionName(id) {
        const {name} = this.getFunction(id)

        return name
    }

    getCallTypes(funName) {
        const fun = this.getFunction(this.getFunctionId(funName))

        if (fun) {
            const types = fun.args.valueTypes.map(t => this.resolveType(t))
            return {
                types,
                required: types.length
            }
        }

        if (funName === 'init') {
            return {types: [], required: 0}
        }

        throw new TypeResolveError(`Unknown function ${funName}`)
    }

    getEventType(topics) {
        const fun = this.getFunction(this.getFunctionId('Chain.event'))

        if (!fun) {
            throw new TypeResolveError('The contract does not have event declaration')
        }

        const variantType = fun.args.valueTypes[0]

        return FateTypeEvent(this.resolveType(variantType), topics)
    }

    resolveType(type) {
        if (type.name === 'variant') {
            const variants = type.variants.map((el, idx) => {
                const valueTypes = el.valueTypes.map(v => this.resolveType(v))
                return {[idx]: valueTypes}
            })

            return FateTypeVariant(variants)
        }

        return type
    }
}

module.exports = BytecodeTypeResolver

const assert = require('./utils/assert')

const zip = (arr, ...arrs) => {
    return arr.map((val, i) => arrs.reduce((a, curr) => [...a, curr[i]], [val]))
}

class DataFactory {
    constructor(aci) {
        this.aci = aci
    }

    create(types, values) {
        assert(
            values.length === types.length,
            `Number of types (${types.length}) and values (${values.length}) should match`
        )

        return zip(types, values).map(el => this.createData(...el))
    }

    createData(type, value) {
        const factory = this.#factories.find(f => f.supports(type))
        assert(factory, `Unsupported type: ${JSON.stringify(type)}`)
        const internalValue = this.#mapper.toInternal(type, value)

        return factory.create(type, internalValue)
    }
}

module.exports = DataFactory

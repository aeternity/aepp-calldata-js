const assert = require('./utils/assert')
const PrimitiveDataFactory = require('./DataFactory/PrimitiveDataFactory')
const ListDataFactory = require('./DataFactory/ListDataFactory')
const MapDataFactory = require('./DataFactory/MapDataFactory')
const TupleDataFactory = require('./DataFactory/TupleDataFactory')
const RecordDataFactory = require('./DataFactory/RecordDataFactory')
const VariantDataFactory = require('./DataFactory/VariantDataFactory')

const zip = (arr, ...arrs) => {
    return arr.map((val, i) => arrs.reduce((a, curr) => [...a, curr[i]], [val]))
}

class DataFactory {
    #factories

    #mapper

    constructor(mapper) {
        this.#mapper = mapper
        this.#factories = [
            new PrimitiveDataFactory(this),
            new ListDataFactory(this),
            new MapDataFactory(this),
            new TupleDataFactory(this),
            new RecordDataFactory(this),
            new VariantDataFactory(this),
        ]
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

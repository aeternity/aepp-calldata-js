const assert = require('../utils/assert')
const PrimitiveDataFactory = require('./PrimitiveDataFactory')
const ListDataFactory = require('./ListDataFactory')
const MapDataFactory = require('./MapDataFactory')
const TupleDataFactory = require('./TupleDataFactory')
const RecordDataFactory = require('./RecordDataFactory')
const VariantDataFactory = require('./VariantDataFactory')
const EventDataFactory = require('./EventDataFactory')

const zip = (arr, ...arrs) => {
    return arr.map((val, i) => arrs.reduce((a, curr) => [...a, curr[i]], [val]))
}

class CompositeDataFactory {
    #factories

    constructor() {
        const variantFactory = new VariantDataFactory(this)
        this.#factories = [
            new PrimitiveDataFactory(this),
            new ListDataFactory(this),
            new MapDataFactory(this),
            new TupleDataFactory(this),
            new RecordDataFactory(this),
            new EventDataFactory(this, variantFactory),
            variantFactory,
        ]
    }

    createMultiple(types, values) {
        assert(
            values.length === types.length,
            `Number of types (${types.length}) and values (${values.length}) should match`
        )

        return zip(types, values).map(el => this.create(...el))
    }

    create(type, value) {
        const factory = this.#factories.find(f => f.supports(type))
        assert(factory, `Unsupported type: ${JSON.stringify(type)}`)

        return factory.create(type, value)
    }
}

module.exports = CompositeDataFactory

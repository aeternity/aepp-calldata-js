const assert = require('../utils/assert')
const zip = require('../utils/zip')
const PrimitiveDataFactory = require('./PrimitiveDataFactory')
const ListDataFactory = require('./ListDataFactory')
const SetDataFactory = require('./SetDataFactory')
const MapDataFactory = require('./MapDataFactory')
const TupleDataFactory = require('./TupleDataFactory')
const RecordDataFactory = require('./RecordDataFactory')
const VariantDataFactory = require('./VariantDataFactory')
const EventDataFactory = require('./EventDataFactory')
const Bls12381DataFactory = require('./Bls12381DataFactory')
const CallDataFactory = require('./CallDataFactory')

class CompositeDataFactory {
    constructor() {
        this._factories = [
            new PrimitiveDataFactory(this),
            new ListDataFactory(this),
            new SetDataFactory(this),
            new MapDataFactory(this),
            new TupleDataFactory(this),
            new RecordDataFactory(this),
            new EventDataFactory(this),
            new VariantDataFactory(this),
            new Bls12381DataFactory(this),
            new CallDataFactory(this),
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
        const factory = this._factories.find(f => f.supports(type))
        assert(factory, `Unsupported type "${type.name}"`)

        return factory.create(type, value)
    }
}

module.exports = CompositeDataFactory

import assert from '../utils/assert.js'
import zip from '../utils/zip.js'
import PrimitiveDataFactory from './PrimitiveDataFactory.js'
import ListDataFactory from './ListDataFactory.js'
import SetDataFactory from './SetDataFactory.js'
import MapDataFactory from './MapDataFactory.js'
import TupleDataFactory from './TupleDataFactory.js'
import RecordDataFactory from './RecordDataFactory.js'
import VariantDataFactory from './VariantDataFactory.js'
import EventDataFactory from './EventDataFactory.js'
import Bls12381DataFactory from './Bls12381DataFactory.js'
import CallDataFactory from './CallDataFactory.js'

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

export default CompositeDataFactory

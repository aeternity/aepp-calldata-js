const TypeFactory = require('./TypeFactory.js')
const FateData = require('./types/FateData.js')
const AddressSerializer = require('./Serializers/AddressSerializer')
const BitsSerializer = require('./Serializers/BitsSerializer')
const BoolSerializer = require('./Serializers/BoolSerializer')
const ByteArraySerializer = require('./Serializers/ByteArraySerializer')
const BytesSerializer = require('./Serializers/BytesSerializer')
const ChannelSerializer = require('./Serializers/ChannelSerializer')
const ContractSerializer = require('./Serializers/ContractSerializer')
const IntSerializer = require('./Serializers/IntSerializer')
const VoidSerializer = require('./Serializers/VoidSerializer')
const ListSerializer = require('./Serializers/ListSerializer')
const MapSerializer = require('./Serializers/MapSerializer')
const OracleQuerySerializer = require('./Serializers/OracleQuerySerializer')
const OracleSerializer = require('./Serializers/OracleSerializer')
const StringSerializer = require('./Serializers/StringSerializer')
const TupleSerializer = require('./Serializers/TupleSerializer')
const VariantSerializer = require('./Serializers/VariantSerializer')

const ucFirst = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

const _serializers = {}

class Serializer {
    static register(type, instance) {
        _serializers[type] = instance
    }
    constructor() {
        this.typeFactory = new TypeFactory()
    }
    serialize(data) {
        if (typeof data !== 'object') {
            throw new Error('Only object serialization is supported.')
        }

        if (!data instanceof FateData) {
            throw new Error('Only instances of FateData is supported.')
        }

        // drop FateType prefix
        const typeName = data.constructor.name.slice(4)
        if (!_serializers.hasOwnProperty(typeName)) {
            throw new Error(`Unsupported type: ` + JSON.stringify(typeName));
        }

        return _serializers[typeName].serialize(data)
    }
    deserialize(type, data) {
        if (!data instanceof Uint8Array) {
            throw new Error('Only instances of Uint8Array is supported.')
        }

        return this._getSerializer(type).deserialize(data, type)
    }
    deserializeStream(data, typeInfo) {
        if (!data instanceof Uint8Array) {
            throw new Error('Only instances of Uint8Array is supported.')
        }

        // in general the type factory needs to support only composite types
        // after the implementation of typeInfo in the serializers
        // however it is fully implmented for completenes

        let type = typeInfo
        if (typeof typeInfo === 'undefined') {
            type = this.typeFactory.createType(data)
        }

        const serializer = this._getSerializer(type)

        if (typeof serializer.deserializeStream !== 'function') {
            throw new Error('Unsupported stream deserialization for type: ' + JSON.stringify(type))
        }

        return serializer.deserializeStream(data, typeInfo)
    }
    _getSerializer(type) {
        if (!type.hasOwnProperty('name')) {
            throw new Error('Unsupported type: ' + JSON.stringify(type))
        }

        // drop FateType prefix
        const typeName = type.name.split('_').map(ucFirst).join('');
        if (!_serializers.hasOwnProperty(typeName)) {
            throw new Error(`Unsupported type: ` + JSON.stringify(typeName));
        }

        return _serializers[typeName]
    }
}

const globalSerializer = new Serializer()
const tupleSerializer = new TupleSerializer(globalSerializer)

Serializer.register('Void', new VoidSerializer())
Serializer.register('Bool', new BoolSerializer())
Serializer.register('Int', new IntSerializer())
Serializer.register('Tuple', tupleSerializer)
Serializer.register('List', new ListSerializer(globalSerializer))
Serializer.register('Map', new MapSerializer(globalSerializer))
Serializer.register('ByteArray', new ByteArraySerializer())
Serializer.register('String', new StringSerializer())
Serializer.register('Hash', new BytesSerializer())
Serializer.register('Signature', new BytesSerializer())
Serializer.register('Bits', new BitsSerializer())
Serializer.register('Variant', new VariantSerializer(globalSerializer))
Serializer.register('Bytes', new BytesSerializer())
Serializer.register('AccountAddress', new AddressSerializer())
Serializer.register('ContractAddress', new ContractSerializer())
Serializer.register('OracleAddress', new OracleSerializer())
Serializer.register('OracleQueryAddress', new OracleQuerySerializer())
Serializer.register('ChannelAddress', new ChannelSerializer())
Serializer.register('Record', tupleSerializer)

module.exports = Serializer

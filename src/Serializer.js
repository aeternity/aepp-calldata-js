const TypeFactory = require('./TypeFactory')
const FateData = require('./types/FateData')
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
const SerializerError = require('./Errors/SerializerError')

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
            throw new SerializerError('Only object serialization is supported. Got: ' + JSON.stringify(data))
        }

        if (!(data instanceof FateData)) {
            throw new SerializerError('Only instances of FateData is supported.')
        }

        const typeName = data.name
        if (!_serializers.hasOwnProperty(typeName)) {
            throw new SerializerError('Unsupported type: ' + JSON.stringify(typeName))
        }

        return _serializers[typeName].serialize(data)
    }

    deserialize(type, data) {
        if (!(data instanceof Uint8Array)) {
            throw new SerializerError('Only instances of Uint8Array is supported.')
        }

        return this._getSerializer(type).deserialize(data, type)
    }

    deserializeStream(data, typeInfo) {
        if (!(data instanceof Uint8Array)) {
            throw new SerializerError('Only instances of Uint8Array is supported.')
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
            throw new SerializerError('Unsupported stream deserialization for type: ' + JSON.stringify(type))
        }

        return serializer.deserializeStream(data, typeInfo)
    }

    _getSerializer(type) {
        if (!type.hasOwnProperty('name')) {
            throw new SerializerError('Unsupported type: ' + JSON.stringify(type))
        }

        const typeName = type.name
        if (!_serializers.hasOwnProperty(typeName)) {
            throw new SerializerError('Unsupported type: ' + JSON.stringify(typeName))
        }

        return _serializers[typeName]
    }
}

const globalSerializer = new Serializer()
const tupleSerializer = new TupleSerializer(globalSerializer)

Serializer.register('void', new VoidSerializer())
Serializer.register('bool', new BoolSerializer())
Serializer.register('int', new IntSerializer())
Serializer.register('tuple', tupleSerializer)
Serializer.register('record', tupleSerializer)
Serializer.register('list', new ListSerializer(globalSerializer))
Serializer.register('map', new MapSerializer(globalSerializer))
Serializer.register('byte_array', new ByteArraySerializer())
Serializer.register('string', new StringSerializer())
Serializer.register('hash', new BytesSerializer())
Serializer.register('signature', new BytesSerializer())
Serializer.register('bits', new BitsSerializer())
Serializer.register('variant', new VariantSerializer(globalSerializer))
Serializer.register('bytes', new BytesSerializer())
Serializer.register('account_address', new AddressSerializer())
Serializer.register('contract_address', new ContractSerializer())
Serializer.register('oracle_address', new OracleSerializer())
Serializer.register('oracle_query_address', new OracleQuerySerializer())
Serializer.register('channel_address', new ChannelSerializer())

module.exports = Serializer

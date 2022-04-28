const TypeFactory = require('./TypeFactory')
const FateData = require('./types/FateData')
const BaseSerializer = require('./Serializers/BaseSerializer')
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
const SetSerializer = require('./Serializers/SetSerializer')
const MapSerializer = require('./Serializers/MapSerializer')
const OracleQuerySerializer = require('./Serializers/OracleQuerySerializer')
const OracleSerializer = require('./Serializers/OracleSerializer')
const StringSerializer = require('./Serializers/StringSerializer')
const TupleSerializer = require('./Serializers/TupleSerializer')
const VariantSerializer = require('./Serializers/VariantSerializer')
const Bls12381FieldSerializer = require('./Serializers/Bls12381FieldSerializer')
const SerializerError = require('./Errors/SerializerError')

class Serializer extends BaseSerializer {
    constructor() {
        super()

        this.typeFactory = new TypeFactory()
        this._serializers = {
            'void': new VoidSerializer(),
            'bool': new BoolSerializer(),
            'int': new IntSerializer(),
            'tuple': new TupleSerializer(this),
            'record': new TupleSerializer(this),
            'list': new ListSerializer(this),
            'set': new SetSerializer(this),
            'map': new MapSerializer(this),
            'byte_array': new ByteArraySerializer(),
            'string': new StringSerializer(),
            'hash': new BytesSerializer(),
            'signature': new BytesSerializer(),
            'bits': new BitsSerializer(),
            'variant': new VariantSerializer(this),
            'bytes': new BytesSerializer(),
            'account_address': new AddressSerializer(),
            'contract_address': new ContractSerializer(),
            'oracle_address': new OracleSerializer(),
            'oracle_query_address': new OracleQuerySerializer(),
            'channel_address': new ChannelSerializer(),
            'bls12_381.fr': new Bls12381FieldSerializer(),
            'bls12_381.fp': new Bls12381FieldSerializer(),
        }
    }

    _getSerializer(type) {
        if (!type.hasOwnProperty('name')) {
            throw new SerializerError('Unsupported type: ' + JSON.stringify(type))
        }

        const typeName = type.name
        if (!this._serializers.hasOwnProperty(typeName)) {
            throw new SerializerError('Unsupported type: ' + JSON.stringify(typeName))
        }

        return this._serializers[typeName]
    }

    serialize(data) {
        if (typeof data !== 'object') {
            throw new SerializerError('Only object serialization is supported. Got: ' + JSON.stringify(data))
        }

        if (!(data instanceof FateData)) {
            throw new SerializerError('Only instances of FateData is supported.')
        }

        return this._getSerializer(data).serialize(data)
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

        let type = typeInfo
        if (typeof typeInfo === 'undefined') {
            type = this.typeFactory.createType(data)
        }

        return this._getSerializer(type).deserializeStream(data, typeInfo)
    }
}

module.exports = Serializer

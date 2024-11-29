import TypeFactory from './TypeFactory.js'
import FateData from './types/FateData.js'
import BaseSerializer from './Serializers/BaseSerializer.js'
import AddressSerializer from './Serializers/AddressSerializer.js'
import BitsSerializer from './Serializers/BitsSerializer.js'
import BoolSerializer from './Serializers/BoolSerializer.js'
import ByteArraySerializer from './Serializers/ByteArraySerializer.js'
import BytesSerializer from './Serializers/BytesSerializer.js'
import ChannelSerializer from './Serializers/ChannelSerializer.js'
import ContractSerializer from './Serializers/ContractSerializer.js'
import IntSerializer from './Serializers/IntSerializer.js'
import VoidSerializer from './Serializers/VoidSerializer.js'
import ListSerializer from './Serializers/ListSerializer.js'
import SetSerializer from './Serializers/SetSerializer.js'
import MapSerializer from './Serializers/MapSerializer.js'
import OracleQuerySerializer from './Serializers/OracleQuerySerializer.js'
import OracleSerializer from './Serializers/OracleSerializer.js'
import StringSerializer from './Serializers/StringSerializer.js'
import TupleSerializer from './Serializers/TupleSerializer.js'
import VariantSerializer from './Serializers/VariantSerializer.js'
import Bls12381FieldSerializer from './Serializers/Bls12381FieldSerializer.js'
import CalldataSerializer from './Serializers/CalldataSerializer.js'
import ContractBytecodeSerializer from './Serializers/ContractBytecodeSerializer.js'
import TypeSerializer from './Serializers/TypeSerializer.js'
import SerializerError from './Errors/SerializerError.js'

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
            'account_pubkey': new AddressSerializer(),
            'contract_pubkey': new ContractSerializer(),
            'oracle_pubkey': new OracleSerializer(),
            'oracle_query_id': new OracleQuerySerializer(),
            'channel': new ChannelSerializer(),
            'bls12_381.fr': new Bls12381FieldSerializer(),
            'bls12_381.fp': new Bls12381FieldSerializer(),
            'calldata': new CalldataSerializer(this),
            'contract_bytearray': new ContractBytecodeSerializer(this),
            'type': new TypeSerializer(),
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

    deserializeWithType(data, type) {
        if (!(data instanceof Uint8Array)) {
            throw new SerializerError('Only instances of Uint8Array is supported.')
        }

        return this._getSerializer(type).deserialize(data, type)
    }

    deserialize(data) {
        if (!(data instanceof Uint8Array)) {
            throw new SerializerError('Only instances of Uint8Array is supported.')
        }

        const type = this.typeFactory.createType(data)

        return this.deserializeWithType(data, type)
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

export default Serializer

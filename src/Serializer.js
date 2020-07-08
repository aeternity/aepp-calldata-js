const FateData = require('./types/FateData.js')
const AddressSerializer = require('./Serializers/AddressSerializer')
const BitsSerializer = require('./Serializers/BitsSerializer')
const BoolSerializer = require('./Serializers/BoolSerializer')
const ByteArraySerializer = require('./Serializers/ByteArraySerializer')
const BytesSerializer = require('./Serializers/BytesSerializer')
const ChannelSerializer = require('./Serializers/ChannelSerializer')
const ContractSerializer = require('./Serializers/ContractSerializer')
const IntSerializer = require('./Serializers/IntSerializer')
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

Serializer = {
    serializers: {},
    register: function(type, instance) {
        this.serializers[type] = instance
    },
    serialize: function (data) {
        if (typeof data !== 'object') {
            throw new Error('Only object serialization is supported.')
        }

        if (!data instanceof FateData) {
            throw new Error('Only instances of FateData is supported.')
        }

        // drop FateType prefix
        const typeName = data.constructor.name.slice(4)
        if (!this.serializers.hasOwnProperty(typeName)) {
            throw new Error(`Unsupported type: ` + JSON.stringify(typeName));
        }

        return this.serializers[typeName].serialize(data)
    },
    deserialize: function(type, data) {
        if (!type.hasOwnProperty('name')) {
            throw new Error('Unsupported type: ' + JSON.stringify(type))
        }

        if (!data instanceof Uint8Array) {
            throw new Error('Only instances of Uint8Array is supported.')
        }

        // drop FateType prefix
        const typeName = type.name.split('_').map(ucFirst).join('');
        if (!this.serializers.hasOwnProperty(typeName)) {
            throw new Error(`Unsupported type: ` + JSON.stringify(typeName));
        }

        return this.serializers[typeName].deserialize(data)
    }
}

Serializer.register('Bool', new BoolSerializer())
Serializer.register('Int', new IntSerializer())
Serializer.register('Tuple', new TupleSerializer(Serializer))
Serializer.register('List', new ListSerializer(Serializer))
Serializer.register('Map', new MapSerializer(Serializer))
Serializer.register('ByteArray', new ByteArraySerializer())
Serializer.register('String', new StringSerializer())
Serializer.register('Hash', new BytesSerializer())
Serializer.register('Signature', new BytesSerializer())
Serializer.register('Bits', new BitsSerializer())
Serializer.register('Variant', new VariantSerializer(Serializer))
Serializer.register('Bytes', new BytesSerializer())
Serializer.register('AccountAddress', new AddressSerializer())
Serializer.register('ContractAddress', new ContractSerializer())
Serializer.register('OracleAddress', new OracleSerializer())
Serializer.register('OracleQueryAddress', new OracleQuerySerializer())
Serializer.register('ChannelAddress', new ChannelSerializer())

module.exports = Serializer

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

Serializer = {
    serializers: {},
    register: function(type, instance) {
        this.serializers[type] = instance
    },
    serialize: function (data) {
        // BC primitive types
        let type = data
        if (Array.isArray(data)) {
            [type, value] = data
        }

        // BC FateTypes
        let typeName = type
        if (type.hasOwnProperty('name')) {
            typeName = type['name']
        }

        if (!this.serializers.hasOwnProperty(typeName)) {
            throw new Error(`Unsupported type: ${typeName}`);
        }

        if (data instanceof FateData) {
            return this.serializers[data.name].serialize(data)
        }

        // temp solution
        if (typeName === 'variant') {
            return this.serializers[typeName].serialize(data)
        }

        return this.serializers[typeName].serialize(value)
    }
}

Serializer.register('bool', new BoolSerializer())
Serializer.register('int', new IntSerializer())
Serializer.register('tuple', new TupleSerializer(Serializer))
//TODO, nested list
Serializer.register('list', new ListSerializer(Serializer))
//TODO, nested map
Serializer.register('map', new MapSerializer(Serializer))
Serializer.register('byte_array', new ByteArraySerializer())
Serializer.register('string', new StringSerializer())
Serializer.register('bits', new BitsSerializer())
Serializer.register('variant', new VariantSerializer(Serializer))
Serializer.register('bytes', new BytesSerializer())
Serializer.register('account_address', new AddressSerializer())
Serializer.register('contract_address', new ContractSerializer())
Serializer.register('oracle_address', new OracleSerializer())
Serializer.register('oracle_query_address', new OracleQuerySerializer())
Serializer.register('channel_address', new ChannelSerializer())

module.exports = Serializer

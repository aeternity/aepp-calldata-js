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
        if (typeof data !== 'object') {
            throw new Error('Only object serialization is supported.')
        }

        if (!data instanceof FateData) {
            throw new Error('Only instances of FateData is supported.')
        }

        const typeName = data.constructor.name
        if (!this.serializers.hasOwnProperty(typeName)) {
            throw new Error(`Unsupported type: ` + JSON.stringify(typeName));
        }

        return this.serializers[typeName].serialize(data)
    }
}

Serializer.register('FateBool', new BoolSerializer())
Serializer.register('FateInt', new IntSerializer())
Serializer.register('FateTuple', new TupleSerializer(Serializer))
Serializer.register('FateList', new ListSerializer(Serializer))
Serializer.register('FateMap', new MapSerializer(Serializer))
Serializer.register('FateByteArray', new ByteArraySerializer())
Serializer.register('FateString', new StringSerializer())
Serializer.register('FateBits', new BitsSerializer())
Serializer.register('FateVariant', new VariantSerializer(Serializer))
Serializer.register('FateBytes', new BytesSerializer())
Serializer.register('FateAccountAddress', new AddressSerializer())
Serializer.register('FateContractAddress', new ContractSerializer())
Serializer.register('FateOracleAddress', new OracleSerializer())
Serializer.register('FateOracleQueryAddress', new OracleQuerySerializer())
Serializer.register('FateChannelAddress', new ChannelSerializer())

module.exports = Serializer

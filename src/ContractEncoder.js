const ApiEncoder = require('./ApiEncoder')
const Serializer = require('./Serializer')
const ContractBytecodeSerializer = require('./Serializers/ContractBytecodeSerializer')
const IntSerializer = require('./Serializers/IntSerializer')
const FateTag = require('./FateTag')

class ContractEncoder {
    constructor() {
        this._apiEncoder = new ApiEncoder()
        this._contractBytecodeSerializer = new ContractBytecodeSerializer(new Serializer())
        this._intSerializer = new IntSerializer()
    }

    /**
     * Decodes serialized contract metadata and bytecode
     *
     * @param {string} data - Contract bytearray data in a canonical format.
     * @returns {Object} Decoded contract metadata as POJO.
    */
    decode(data) {
        const bytecode = this._apiEncoder.decodeWithType(data, 'contract_bytearray')

        const fateContractBytearray = new Uint8Array([
            FateTag.CONTRACT_BYTEARRAY,
            ...this._intSerializer.serialize(bytecode.length),
            ...bytecode,
        ])

        return this._contractBytecodeSerializer.deserialize(fateContractBytearray)
    }
}

module.exports = ContractEncoder

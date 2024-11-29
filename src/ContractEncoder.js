import ApiEncoder from './ApiEncoder.js'
import Serializer from './Serializer.js'
import ContractBytecodeSerializer from './Serializers/ContractBytecodeSerializer.js'
import IntSerializer from './Serializers/IntSerializer.js'
import FateTag from './FateTag.js'

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

export default ContractEncoder

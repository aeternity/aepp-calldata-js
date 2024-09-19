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
     * Encodes POJO contract
     *
     * @param {Object} contract - Contract metadata as POJO.
     * @returns {Object} Contract bytearray data in a canonical format.
    */
    encode(contract) {
        const binData = this._contractBytecodeSerializer.serialize(contract)
        const [_len, remainder] = this._intSerializer.deserializeStream(binData.slice(1))
        return this._apiEncoder.encode('contract_bytearray', remainder)
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

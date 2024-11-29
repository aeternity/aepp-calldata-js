import ApiEncoder from '../ApiEncoder.js'
import ChainObjectSerializer from './ChainObjectSerializer.js'
import ChainObjectEncoder from './ChainObjectEncoder.js'
import PrimitivesEncoder from '../PrimitivesEncoder.js'
import IdEncoder from '../IdEncoder.js'
import FieldsEncoder from './FieldsEncoder.js'

class FieldEncoder {
    constructor(additionalEncoders, additionalDecoders) {
        this.primEncoder = new PrimitivesEncoder()
        this.apiEncoder = new ApiEncoder()
        this.idEncoder = new IdEncoder(this.apiEncoder)

        const fieldsEncoder = new FieldsEncoder(this)
        this.chainObjectEncoder = new ChainObjectEncoder(fieldsEncoder)
        this.chainObjectSerializer = new ChainObjectSerializer(fieldsEncoder)

        this.decoders = {
            key_block_hash: (value) => this.apiEncoder.encode('key_block_hash', value),
            micro_block_hash: (value) => this.apiEncoder.encode('micro_block_hash', value),
            block_pof_hash: (value) => this.apiEncoder.encode('block_pof_hash', value),
            block_tx_hash: (value) => this.apiEncoder.encode('block_tx_hash', value),
            block_state_hash: (value) => this.apiEncoder.encode('block_state_hash', value),
            signature: (value) => this.apiEncoder.encode('signature', value),
            peer_pubkey: (value) => this.apiEncoder.encode('peer_pubkey', value),
            account_pubkey: (value) => this.apiEncoder.encode('account_pubkey', value),
            tx_hash: (value) => this.apiEncoder.encode('tx_hash', value),
            bytearray: (value) => this.apiEncoder.encode('bytearray', value),
            id: (value) => this.idEncoder.encode(value),
            key_block: (value, _params) => this.chainObjectEncoder.decode('key_block', value),
            micro_block: (value, _params) => this.chainObjectEncoder.decode('micro_block', value),
            light_micro_block: (value, _params) => this.chainObjectEncoder.decode('light_micro_block', value),
            chain_object: (value) => this.chainObjectSerializer.deserialize(value),
            ...additionalDecoders
        }

        this.encoders = {
            key_block_hash: (value) => this.apiEncoder.decode(value),
            micro_block_hash: (value) => this.apiEncoder.decode(value),
            block_pof_hash: (value) => this.apiEncoder.decode(value),
            block_tx_hash: (value) => this.apiEncoder.decode(value),
            block_state_hash: (value) => this.apiEncoder.decode(value),
            signature: (value) => this.apiEncoder.decode(value),
            peer_pubkey: (value) => this.apiEncoder.decode(value),
            account_pubkey: (value) => this.apiEncoder.decode(value),
            tx_hash: (value) => this.apiEncoder.decode(value),
            bytearray: (value) => this.apiEncoder.decode(value),
            id: (value) => this.idEncoder.decode(value),
            key_block: (value, _params) => this.chainObjectEncoder.encode(value),
            micro_block: (value, _params) => this.chainObjectEncoder.encode(value),
            light_micro_block: (value, _params) => this.chainObjectEncoder.encode(value),
            chain_object: (value) => this.chainObjectSerializer.serialize(value),
            ...additionalEncoders
        }
    }

    encode(type, value, params) {
        return this.encoders.hasOwnProperty(type) ? this.encoders[type](value, params) : value
    }

    decode(type, value, params) {
        return this.decoders.hasOwnProperty(type) ? this.decoders[type](value, params) : value
    }
}

export default FieldEncoder

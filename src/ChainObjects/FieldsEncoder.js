const PrimitivesEncoder = require('../PrimitivesEncoder')

const TYPE2SIZE = {
    uint_32: 4,
    uint_64: 8,
    account_pubkey: 32,
    key_block_hash: 32,
    micro_block_hash: 32,
    block_pof_hash: 32,
    block_tx_hash: 32,
    block_state_hash: 32,
    signature: 64,
    pow: 168,
}

class FieldsEncoder {
    constructor(fieldEncoder) {
        this.fieldEncoder = fieldEncoder
        this.primEncoder = new PrimitivesEncoder()
    }

    /**
     * Encode data fields according to a template
     *
     * @param {object} data - An object with field => value items
     * @param {object} template - An object with field => type items
     * @returns {array} A poisioned array of encoded fields with preserved order
    */
    encodeFields(data, template) {
        const chunks = []

        for (const field in template) {
            if (Object.hasOwn(template, field)) {
                const type = template[field]
                const encoded = this.#encodeField(type, data[field])

                chunks.push(encoded)
            }
        }

        return chunks
    }

    /**
     * Decode data fields according to a template
     *
     * @param {array} data - An array with positioned values according to the template
     * @param {object} template - An object with field => type items
     * @returns {object} An object with decoded field => value items
    */
    decodeFields(data, template) {
        const chunks = {}
        let idx = 0

        for (const field in template) {
            if (Object.hasOwn(template, field)) {
                const type = template[field]
                chunks[field] = this.#decodeField(type, data[idx])
                idx++
            }
        }

        return chunks
    }

    // Split data stream into fields based on their size
    splitFields(stream, template) {
        const fields = []
        let idx = 0

        for (const field in template) {
            if (Object.hasOwn(template, field)) {
                const size = this.#sizeOf(template[field])
                fields.push(stream.slice(idx, idx + size))
                idx += size
            }
        }

        return fields
    }

    #sizeOf(type) {
        // most (all?) chain objects does not have fixed size
        // thus they can be nested in other objects only as last field
        // size of Infinity would split all the rest bytes to that field
        if (type === 'chain_object') {
            return Infinity
        }

        if (Object.getPrototypeOf(type) === Object.prototype) {
            let objectSize = 0
            for (const field in type.template) {
                if (Object.hasOwn(type.template, field)) {
                    objectSize += this.#sizeOf(type.template[field])
                }
            }

            return objectSize
        }

        if (!TYPE2SIZE.hasOwnProperty(type)) {
            throw new Error(`Unknown size of type "${type}"`)
        }

        return TYPE2SIZE[type]
    }

    #encodeField(typeInfo, value) {
        if (Array.isArray(typeInfo)) {
            return value.map(v => this.#encodeField(typeInfo[0], v))
        }

        if (Object.getPrototypeOf(typeInfo) === Object.prototype) {
            const {template} = typeInfo

            return new Uint8Array(this.encodeFields(value, template).flatMap(e => [...e]))
        }

        if (this.primEncoder.supports(typeInfo)) {
            return this.primEncoder.encode(typeInfo, value)
        }

        return this.fieldEncoder.encode(typeInfo, value)
    }

    #decodeField(typeInfo, value) {
        if (Array.isArray(typeInfo)) {
            return value.map(v => this.#decodeField(typeInfo[0], v))
        }

        if (Object.getPrototypeOf(typeInfo) === Object.prototype) {
            const {template} = typeInfo
            const objectFields = this.splitFields(value, template)

            return this.decodeFields(objectFields, template)
        }

        if (this.primEncoder.supports(typeInfo)) {
            return this.primEncoder.decode(typeInfo, value)
        }

        return this.fieldEncoder.decode(typeInfo, value)
    }
}

module.exports = FieldsEncoder

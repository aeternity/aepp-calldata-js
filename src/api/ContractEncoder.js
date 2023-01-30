const InternalEncoder = require('../ContractEncoder')

class ContractEncoder {
    constructor() {
        this._internalEncoder = new InternalEncoder()
    }

    /**
     * Decode serialized contract data
     *
     * @param {string} data - FATE API encoded data in canonical format.
     * @returns {Object} Decoded data
    */
    decode(data) {
        return this._internalEncoder.decode(data)
    }
}

module.exports = ContractEncoder

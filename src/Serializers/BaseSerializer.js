const SerializerError = require('../Errors/SerializerError')

class BaseSerializer {
    constructor(globalSerializer) {
        this.globalSerializer = globalSerializer
    }

    serialize(_data) {
        throw new SerializerError('Not implemented.')
    }

    deserialize(data, typeInfo) {
        const [value, _rest] = this.deserializeStream(data, typeInfo)

        return value
    }

    deserializeStream(_data, _typeInfo) {
        throw new SerializerError('Not implemented.')
    }
}

module.exports = BaseSerializer

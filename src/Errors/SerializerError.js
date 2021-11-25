class SerializerError extends Error {
    constructor(message) {
        super(message)
        this.name = 'SerializerError'
    }
}

module.exports = SerializerError

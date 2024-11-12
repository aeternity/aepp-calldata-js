class SerializerError extends Error {
    constructor(message) {
        super(message)
        this.name = 'SerializerError'
    }
}

export default SerializerError

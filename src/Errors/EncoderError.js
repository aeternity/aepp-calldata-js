class EncoderError extends Error {
    constructor(message) {
        super(message)
        this.name = 'EncoderError'
    }
}

export default EncoderError

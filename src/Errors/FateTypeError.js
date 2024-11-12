class FateTypeError extends Error {
    constructor(type, message) {
        super(message)
        this.name = 'FateTypeError'
        this.type = type
    }
}

export default FateTypeError

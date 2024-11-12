class FormatError extends Error {
    constructor(message) {
        super(message)
        this.name = 'FormatError'
    }
}

export default FormatError

class InternalError extends Error {
    constructor(message) {
        super(message)
        this.name = 'InternalError'
    }
}

module.exports = InternalError

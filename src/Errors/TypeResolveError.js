class TypeResolveError extends Error {
    constructor(message) {
        super(message)
        this.name = 'TypeResolveError'
    }
}

module.exports = TypeResolveError

class TypeResolveError extends Error {
    constructor(message) {
        super(message)
        this.name = 'TypeResolveError'
    }
}

export default TypeResolveError

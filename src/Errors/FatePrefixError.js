class FatePrefixError extends Error {
    constructor(prefix) {
        super('Invalid FATE prefix: 0b' + prefix.toString(2).padStart(8, '0'))

        this.name = 'FatePrefixError'
        this.prefix = prefix
    }
}

module.exports = FatePrefixError

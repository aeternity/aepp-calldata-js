const CompositeDataFactory = require('./DataFactory/CompositeDataFactory')

class ExternalDataFactory extends CompositeDataFactory {
    #mapper

    constructor(mapper) {
        super()

        this.#mapper = mapper
    }

    create(type, value) {
        const internalValue = this.#mapper.toInternal(type, value)

        return super.create(type, internalValue)
    }
}

module.exports = ExternalDataFactory

const CompositeDataFactory = require('./DataFactory/CompositeDataFactory')

class ExternalDataFactory extends CompositeDataFactory {
    constructor(mapper) {
        super()

        this._mapper = mapper
    }

    create(type, value) {
        const internalValue = this._mapper.toInternal(type, value)

        return super.create(type, internalValue)
    }
}

module.exports = ExternalDataFactory

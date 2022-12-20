const CompositeDataFactory = require('./DataFactory/CompositeDataFactory')
const InternalMapper = require('./Mapper/InternalMapper')

class ExternalDataFactory extends CompositeDataFactory {
    constructor() {
        super()

        this._mapper = new InternalMapper()
    }

    create(type, value) {
        const internalValue = this._mapper.toInternal(type, value)

        return super.create(type, internalValue)
    }
}

module.exports = ExternalDataFactory

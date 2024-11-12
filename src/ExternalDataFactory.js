import CompositeDataFactory from './DataFactory/CompositeDataFactory.js'
import InternalMapper from './Mapper/InternalMapper.js'

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

export default ExternalDataFactory

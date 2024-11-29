import ApiEncoder from './ApiEncoder.js'
import CompositeDataFactory from './DataFactory/CompositeDataFactory.js'
import CanonicalMapper from './Mapper/CanonicalMapper.js'

class EventEncoder {
    constructor() {
        this._dataFactory = new CompositeDataFactory()
        this._apiEncoder = new ApiEncoder()
        this._canonicalMapper = new CanonicalMapper()
    }

    decodeWithType(data, type) {
        const binData = this._apiEncoder.decode(data)
        const event = this._dataFactory.create(type, binData)

        return this._canonicalMapper.toCanonical(event)
    }
}

export default EventEncoder

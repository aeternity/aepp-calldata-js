import FateVoid from '../types/FateVoid.js'
import BaseSerializer from './BaseSerializer.js'

class VoidSerializer extends BaseSerializer {
    serialize() {
        return ''
    }

    deserialize() {
        return new FateVoid()
    }

    deserializeStream(data) {
        return [new FateVoid(), data]
    }
}

export default VoidSerializer

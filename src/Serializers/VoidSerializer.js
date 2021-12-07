const FateVoid = require('../types/FateVoid')
const BaseSerializer = require('./BaseSerializer')

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

module.exports = VoidSerializer

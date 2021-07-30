const FateVoid = require('../types/FateVoid.js')

class VoidSerializer {
    serialize(data) {
        return ''
    }
    deserialize(data) {
        return new FateVoid()
    }
    deserializeStream(data) {
        return [new FateVoid(), data]
    }
}

module.exports = VoidSerializer

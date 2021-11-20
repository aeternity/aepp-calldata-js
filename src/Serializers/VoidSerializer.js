const FateVoid = require('../types/FateVoid')

class VoidSerializer {
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

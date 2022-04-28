const FateTag = require('../FateTag')
const FateUnit = require('../types/FateUnit')
const BaseSerializer = require('./BaseSerializer')

class UnitSerializer extends BaseSerializer {
    serialize() {
        return [FateTag.EMPTY_TUPLE]
    }

    deserialize() {
        return new FateUnit()
    }

    deserializeStream(data) {
        return [new FateUnit(), data]
    }
}

module.exports = UnitSerializer

const BaseSerializer = require('./BaseSerializer')
const {FateTypeTuple, FateTypeMap} = require('../FateTypes')
const FateMap = require('../types/FateMap')
const FateTuple = require('../types/FateTuple')
const FateSet = require('../types/FateSet')

// This serializer takes advantages of the singular tuple optimization directly
// An alternative implementation would be building the full structure
// and pass it upstream for optimization.
// Unbox singleton tuples and records
// https://github.com/aeternity/aesophia/pull/205
// https://github.com/aeternity/aesophia/commit/a403a9d227ac56266cf5bb8fbc916f17e6141d15

class SetSerializer extends BaseSerializer {
    serialize(set) {
        return this.globalSerializer.serialize(new FateMap(
            set.itemsType,
            FateTypeTuple(),
            set.items.map(i => [i, new FateTuple()])
        ))
    }

    deserializeStream(data, typeInfo) {
        const mapType = FateTypeMap(typeInfo.valuesType, FateTypeTuple())
        const [map, rest] = this.globalSerializer.deserializeStream(data, mapType)

        return [
            new FateSet(typeInfo.valuesType, map.keys),
            rest
        ]
    }
}

module.exports = SetSerializer

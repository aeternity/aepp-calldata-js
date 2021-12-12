const FateMap = require('../types/FateMap')
const BaseDataFactory = require('./BaseDataFactory')

class MapDataFactory extends BaseDataFactory {
    supports({ name, _valueTypes }) {
        return 'map' === name
    }

    create(type, value) {
        const resolvedValues = []
        for (const item of value) {
            resolvedValues.push([
                this.valueFactory.create(type.keyType, item[0]),
                this.valueFactory.create(type.valueType, item[1]),
            ])
        }

        return new FateMap(type.keyType, type.valueType, resolvedValues)
    }
}

module.exports = MapDataFactory

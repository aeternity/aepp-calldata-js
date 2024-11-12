import FateMap from '../types/FateMap.js'
import BaseDataFactory from './BaseDataFactory.js'

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

export default MapDataFactory

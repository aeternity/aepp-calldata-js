import FateSet from '../types/FateSet.js'
import BaseDataFactory from './BaseDataFactory.js'

class SetDataFactory extends BaseDataFactory {
    supports({name, _valueTypes}) {
        return 'set' === name
    }

    create(type, value) {
        const resolvedValues = []
        for (const item of value) {
            resolvedValues.push(this.valueFactory.create(type.valuesType, item))
        }

        return new FateSet(type.valuesType, resolvedValues)
    }
}

export default SetDataFactory

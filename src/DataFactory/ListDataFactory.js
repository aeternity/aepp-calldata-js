import FateList from '../types/FateList.js'
import FateTypeError from '../Errors/FateTypeError.js'
import BaseDataFactory from './BaseDataFactory.js'

class ListDataFactory extends BaseDataFactory {
    supports({name, _valueTypes}) {
        return 'list' === name
    }

    create(type, value) {
        if (!Array.isArray(value)) {
            throw new FateTypeError(
                type.name,
                `Fate list must be an Array, got ${value} instead`
            )
        }

        const resolvedValues = value.map(v => this.valueFactory.create(type.valuesType, v))

        return new FateList(type.valuesType, resolvedValues)
    }
}

export default ListDataFactory

class BaseDataFactory {
    constructor(valueFactory) {
        this._valueFactory = valueFactory
    }

    get valueFactory() {
        return this._valueFactory
    }

    supports({_name, _valueTypes}) {
        return false
    }

    create(_type, _value) {
        throw new Error('Not implemented.')
    }
}

module.exports = BaseDataFactory

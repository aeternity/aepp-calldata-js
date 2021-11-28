class BaseDataFactory {
    #valueFactory

    constructor(valueFactory) {
        this.#valueFactory = valueFactory
    }

    get valueFactory() {
        return this.#valueFactory
    }

    supports({_name, _valueTypes}) {
        return false
    }

    create(_type, _value) {
        throw new Error('Not implemented.')
    }
}

module.exports = BaseDataFactory

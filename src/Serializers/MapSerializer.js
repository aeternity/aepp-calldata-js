const FATE = require('../fate.js')
const RLPInt = require('../utils/RLPInt.js')

MapSerializer = function (globalSerializer) {
    this.globalSerializer = globalSerializer
}

MapSerializer.prototype = {
    serialize: function (value) {
        const [keyKype, valueType, elements] = value
        const len = elements.length

        const serializedElements = elements.map(e => {
            const [key, value] = e
            return [
                this.globalSerializer.serialize([keyKype, key]),
                this.globalSerializer.serialize([valueType, value])
            ]
        })

        return [
            FATE.MAP,
            ...RLPInt(len),
            ...serializedElements.flat(Infinity)
        ]
    }
}

module.exports = MapSerializer

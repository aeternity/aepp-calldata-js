const ObjectTags = require('./ChainObjectTags')

class ChainObject {
    constructor(name, fields) {
        this.name = name
        this.vsn = fields.version || fields.header?.version || 1n

        Object.assign(this, fields)
    }

    get tag() {
        return ObjectTags[this.name.toUpperCase()]
    }
}

module.exports = ChainObject

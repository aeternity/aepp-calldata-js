const RLP = require('rlp')
const ChainObject = require('./ChainObject')
const ObjectTags = require('./ChainObjectTags')
const Templates = require('./ChainObjectTemplates')

class ChainObjectSerializer {
    /**
     * @param {FieldsEncoder} fieldsEncoder
    */
    constructor(fieldsEncoder) {
        this.fieldsEncoder = fieldsEncoder
    }

    serialize(chainObject) {
        const {name, tag, vsn} = chainObject

        const template = Templates[name.toUpperCase()][vsn]
        if (template === undefined) {
            throw new Error(`Unsupported template version "${vsn}" for object type "${name}"`)
        }

        const serializedFields = this.#serializeFields(tag, vsn, template, chainObject)

        return new Uint8Array(serializedFields)
    }

    deserialize(data) {
        const {tag, vsn, rest} = this.#deserializeHeader(data)
        const type = Object.keys(ObjectTags).find(key => ObjectTags[key] === Number(tag))

        if (type === undefined) {
            throw new Error(`Unsupported object tag: ${tag}`)
        }

        if (!Templates.hasOwnProperty(type)) {
            return new ChainObject(type.toLowerCase(), {})
        }

        if (!Templates[type].hasOwnProperty(vsn)) {
            throw new Error(`Unsupported template version "${vsn}" for object type "${type}"`)
        }

        const template = Templates[type][vsn]
        const fields = this.fieldsEncoder.decodeFields(rest, template)

        return new ChainObject(type.toLowerCase(), {vsn, ...fields})
    }

    #deserializeHeader(data) {
        const objData = RLP.decode(data)
        const template = {tag: 'int', vsn: 'int'}

        const {tag, vsn} = this.fieldsEncoder.decodeFields(objData, template)
        const rest = objData.slice(2)

        return {tag, vsn, rest}
    }

    #serializeFields(tag, vsn, template, fields) {
        const allFields = {tag, vsn, ...fields}
        const fullTemplate = {tag: 'int', vsn: 'int', ...template}
        const data = this.fieldsEncoder.encodeFields(allFields, fullTemplate)

        return [...RLP.encode(data)]
    }

    #deserializeFields(template, data) {
        const objData = RLP.decode(data)
        const fullTemplate = {tag: 'int', vsn: 'int', ...template}
        const {_tag, _vsn, ...fields} = this.fieldsEncoder.decodeFields(objData, fullTemplate)

        return fields
    }
}

module.exports = ChainObjectSerializer

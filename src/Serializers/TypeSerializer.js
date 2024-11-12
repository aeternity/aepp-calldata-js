import FateTag from '../FateTag.js'
import BaseSerializer from './BaseSerializer.js'
import IntSerializer from './IntSerializer.js'
import FatePrefixError from '../Errors/FatePrefixError.js'
import FateTypeError from '../Errors/FateTypeError.js'
import {
    FateTypeInt,
    FateTypeBool,
    FateTypeString,
    FateTypeBits,
    FateTypeBytes,
    FateTypeAccountAddress,
    FateTypeContractAddress,
    FateTypeOracleAddress,
    FateTypeOracleQueryAddress,
    FateTypeChannelAddress,
    FateTypeList,
    FateTypeMap,
    FateTypeTuple,
    FateTypeVariant,
    FateTypeVar,
    FateTypeAny,
} from '../FateTypes.js'

const BASIC_TYPES = {
    [FateTag.TYPE_INTEGER]: FateTypeInt(),
    [FateTag.TYPE_BOOLEAN]: FateTypeBool(),
    [FateTag.TYPE_BITS]: FateTypeBits(),
    [FateTag.TYPE_STRING]: FateTypeString(),
    [FateTag.TYPE_ANY]: FateTypeAny(),
}

const OBJECT_TYPES = {
    [FateTag.OTYPE_ADDRESS]: FateTypeAccountAddress(),
    [FateTag.OTYPE_CONTRACT]: FateTypeContractAddress(),
    [FateTag.OTYPE_ORACLE]: FateTypeOracleAddress(),
    [FateTag.OTYPE_ORACLE_QUERY]: FateTypeOracleQueryAddress(),
    [FateTag.OTYPE_CHANNEL]: FateTypeChannelAddress(),
}

class TypeSerializer extends BaseSerializer {
    constructor(globalSerializer) {
        super(globalSerializer)

        this._intSerializer = new IntSerializer()
    }

    serialize(type) {
        const basicTypeTag = Object.entries(BASIC_TYPES)
            .find(([_key, { name }]) => name === type.name)?.[0]
        if (basicTypeTag != null) {
            return new Uint8Array([basicTypeTag])
        }

        const objectTypeTag = Object.entries(OBJECT_TYPES)
            .find(([_key, { name }]) => name === type.name)?.[0]
        if (objectTypeTag != null) {
            return new Uint8Array([FateTag.TYPE_OBJECT, objectTypeTag])
        }

        if (type.name === 'tvar') {
            return new Uint8Array([FateTag.TYPE_VAR, type.id])
        }

        if (type.name === 'bytes') {
            return new Uint8Array([
                FateTag.TYPE_BYTES,
                ...this._intSerializer.serialize(type.size),
            ])
        }

        if (type.name === 'list') {
            return new Uint8Array([
                FateTag.TYPE_LIST,
                ...this.serialize(type.valuesType),
            ])
        }

        if (type.name === 'map') {
            return new Uint8Array([
                FateTag.TYPE_MAP,
                ...this.serialize(type.keyType),
                ...this.serialize(type.valueType),
            ])
        }

        if (type.name === 'tuple') {
            return new Uint8Array([
                FateTag.TYPE_TUPLE,
                type.valueTypes.length,
                ...type.valueTypes.map((t) => [...this.serialize(t)]).flat(),
            ])
        }

        if (type.name === 'variant') {
            return new Uint8Array([
                FateTag.TYPE_VARIANT,
                type.variants.length,
                ...type.variants.map((t) => [...this.serialize(t)]).flat(),
            ])
        }

        throw new FateTypeError(type.name, `Unsupported type: ${type.name}`)
    }

    deserializeStream(data) {
        const buffer = new Uint8Array(data)
        const prefix = buffer[0]

        if (BASIC_TYPES.hasOwnProperty(prefix)) {
            return [BASIC_TYPES[prefix], buffer.slice(1)]
        }

        if (prefix === FateTag.TYPE_OBJECT) {
            const obj = buffer[1]

            if (!OBJECT_TYPES.hasOwnProperty(obj)) {
                throw new FatePrefixError(obj, 'Unsupported object type')
            }

            return [OBJECT_TYPES[obj], buffer.slice(2)]
        }

        if (prefix === FateTag.TYPE_VAR) {
            return [FateTypeVar(buffer[1]), buffer.slice(2)]
        }

        if (prefix === FateTag.TYPE_BYTES) {
            const [size, rest] = this._intSerializer.deserializeStream(buffer.slice(1))

            return [FateTypeBytes(size.valueOf()), rest]
        }

        if (prefix === FateTag.TYPE_LIST) {
            const [elementsType, rest] = this.deserializeStream(buffer.slice(1))

            return [FateTypeList(elementsType), rest]
        }

        if (prefix === FateTag.TYPE_MAP) {
            const [keyType, rest] = this.deserializeStream(buffer.slice(1))
            const [valueType, rest2] = this.deserializeStream(rest)

            return [FateTypeMap(keyType, valueType), rest2]
        }

        if (prefix === FateTag.TYPE_TUPLE) {
            const size = buffer[1]
            const elementTypes = []
            let rest = buffer.slice(2)
            let el

            for (let i = 0; i < size; i++) {
                [el, rest] = this.deserializeStream(rest)
                elementTypes.push(el)
            }

            return [FateTypeTuple(elementTypes), rest]
        }

        if (prefix === FateTag.TYPE_VARIANT) {
            const size = buffer[1]
            const variants = []
            let rest = buffer.slice(2)
            let el

            for (let i = 0; i < size; i++) {
                [el, rest] = this.deserializeStream(rest)
                variants.push(el)
            }

            return [FateTypeVariant(variants), rest]
        }

        throw new FatePrefixError(prefix)
    }
}

export default TypeSerializer

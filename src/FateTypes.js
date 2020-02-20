const PRIMITIVE_TYPES = ['bool', 'int', 'string']

const FateType = (type) => {
    if (typeof type !== 'string') {
        return type
    }

    switch(type) {
        case 'int':
            return FateTypeInt()
            break;
        case 'bool':
            return FateTypeBool()
            break;
        case 'string':
            return FateTypeString()
            break;
        default:
            throw new Error(`Unsupported type: ${type}`)
    } 
}

const FateTypeInt = () => {
    return {name: 'int'}
}

const FateTypeBool = () => {
    return {name: 'bool'}
}

const FateTypeString = () => {
    return {name: 'string'}
}

const FateTypeBits = () => {
    return {name: 'bits'}
}

const FateTypeBytes = (size) => {
    return {name: 'bytes', size}
}

const FateTypeByteArray = () => {
    return {name: 'byte_array'}
}

const FateTypeList = (valuesType) => {
    return {
        name: 'list',
        valuesType: FateType(valuesType)
    }
}

const FateTypeTuple = (valueTypes) => {
    return {
        name: 'tuple',
        valueTypes: valueTypes
    }
}

const FateTypeMap = (keyType, valueType) => {
    return {
        name: 'map',
        keyType: FateType(keyType),
        valueType: FateType(valueType),
    }
}

const FateTypeVariant = (arities, variantType) => {
    return {
        name: 'variant',
        aritiesType: FateTypeInt(),
        arities,
        variantType: FateTypeTuple(variantType),
    }
}

module.exports = {
    PRIMITIVE_TYPES,
    FateType,
    FateTypeInt,
    FateTypeBool,
    FateTypeString,
    FateTypeBits,
    FateTypeBytes,
    FateTypeByteArray,
    FateTypeList,
    FateTypeTuple,
    FateTypeMap,
    FateTypeVariant
}

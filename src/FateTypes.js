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

const FateTypeHash = () => {
    return {name: 'hash'}
}

const FateTypeSignature = () => {
    return {name: 'signature'}
}

const FateTypeAccountAddress = () => {
    return {name: 'account_address'}
}

const FateTypeContractAddress = () => {
    return {name: 'contract_address'}
}

const FateTypeOracleAddress = (questionType, answerType) => {
    return {
        name: 'oracle_address',
        questionType,
        answerType
    }
}

const FateTypeOracleQueryAddress = (questionType, answerType) => {
    return {
        name: 'oracle_query_address',
        questionType,
        answerType
    }
}

const FateTypeByteArray = () => {
    return {name: 'byte_array'}
}

const FateTypeList = (valuesType) => {
    return {
        name: 'list',
        valuesType: valuesType
    }
}

const FateTypeTuple = (valueTypes) => {
    return {
        name: 'tuple',
        valueTypes: valueTypes
    }
}

const FateTypeRecord = (keys, valueTypes) => {
    return {
        name: 'record',
        keys,
        valueTypes,
    }
}

const FateTypeMap = (keyType, valueType) => {
    return {
        name: 'map',
        keyType: keyType,
        valueType: valueType,
    }
}

const FateTypeVariant = (arities, variantType, variants) => {
    return {
        name: 'variant',
        variants,
        aritiesType: FateTypeInt(),
        arities,
        variantType: FateTypeTuple(variantType),
    }
}

const FateTypeOption = (valueTypes) => {
    const variants = [
        { None: []},
        { Some: valueTypes }
    ]

    return FateTypeVariant(0, null, variants)
}

const FateTypeChainTTL = () => {
    const variants = [
        {RelativeTTL: [FateTypeInt()]},
        {FixedTTL: [FateTypeInt()]}
    ]

    return FateTypeVariant(0, null, variants)
}

module.exports = {
    FateTypeInt,
    FateTypeBool,
    FateTypeString,
    FateTypeBits,
    FateTypeBytes,
    FateTypeHash,
    FateTypeSignature,
    FateTypeAccountAddress,
    FateTypeContractAddress,
    FateTypeOracleAddress,
    FateTypeOracleQueryAddress,
    FateTypeByteArray,
    FateTypeList,
    FateTypeTuple,
    FateTypeRecord,
    FateTypeMap,
    FateTypeVariant,
    FateTypeOption,
    FateTypeChainTTL,
}

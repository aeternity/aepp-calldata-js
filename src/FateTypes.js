const FateTypeVoid = () => {
    return {name: 'void'}
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
        valuesType,
    }
}

const FateTypeTuple = (valueTypes = []) => {
    return {
        name: 'tuple',
        valueTypes
    }
}

const FateTypeRecord = (keys, valueTypes) => {
    return {
        name: 'record',
        keys,
        valueTypes,
    }
}

const FateTypeSet = (valuesType) => {
    return {
        name: 'set',
        valuesType,
    }
}

const FateTypeMap = (keyType, valueType) => {
    return {
        name: 'map',
        keyType,
        valueType,
    }
}

const FateTypeVariant = (arities, variantType, variants) => {
    return {
        name: 'variant',
        aritiesType: FateTypeInt(),
        arities,
        variantType: FateTypeTuple(variantType),
        variants,
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

const FateTypeChainGAMetaTx = () => {
    const variants = [
        {'Chain.GAMetaTx': [FateTypeAccountAddress(), FateTypeInt()]},
    ]

    return FateTypeVariant(0, null, variants)
}

const FateTypeChainPayingForTx = () => {
    const variants = [
        {'Chain.PayingForTx': [FateTypeAccountAddress(), FateTypeInt()]},
    ]

    return FateTypeVariant(0, null, variants)
}

const FateTypeChainBaseTx = () => {
    const variants = [
        {'Chain.SpendTx': [FateTypeAccountAddress(), FateTypeInt(), FateTypeString()]},
        {'Chain.OracleRegisterTx': []},
        {'Chain.OracleQueryTx': []},
        {'Chain.OracleResponseTx': []},
        {'Chain.OracleExtendTx': []},
        {'Chain.NamePreclaimTx': []},
        {'Chain.NameClaimTx': [FateTypeString()]},
        {'Chain.NameUpdateTx': [FateTypeHash()]},
        {'Chain.NameRevokeTx': [FateTypeHash()]},
        {'Chain.NameTransferTx': [FateTypeAccountAddress(), FateTypeHash()]},
        {'Chain.ChannelCreateTx': [FateTypeAccountAddress()]},
        {'Chain.ChannelDepositTx': [FateTypeAccountAddress(), FateTypeInt()]},
        {'Chain.ChannelWithdrawTx': [FateTypeAccountAddress(), FateTypeInt()]},
        {'Chain.ChannelForceProgressTx': [FateTypeAccountAddress()]},
        {'Chain.ChannelCloseMutualTx': [FateTypeAccountAddress()]},
        {'Chain.ChannelCloseSoloTx': [FateTypeAccountAddress()]},
        {'Chain.ChannelSlashTx': [FateTypeAccountAddress()]},
        {'Chain.ChannelSettleTx': [FateTypeAccountAddress()]},
        {'Chain.ChannelSnapshotSoloTx': [FateTypeAccountAddress()]},
        {'Chain.ContractCreateTx': [FateTypeAccountAddress()]},
        {'Chain.ContractCallTx': [FateTypeAccountAddress(), FateTypeInt()]},
        {'Chain.GAAttachTx': []},
    ]

    return FateTypeVariant(0, null, variants)
}

const FateTypeAENSPointee = () => {
    const variants = [
        {'AENS.AccountPt': [FateTypeAccountAddress()]},
        {'AENS.OraclePt': [FateTypeAccountAddress()]},
        {'AENS.ContractPt': [FateTypeAccountAddress()]},
        {'AENS.ChannelPt': [FateTypeAccountAddress()]},
    ]

    return FateTypeVariant(0, null, variants)
}

const FateTypeAENSName = () => {
    const variants = [{
        'AENS.Name': [
            FateTypeAccountAddress(),
            FateTypeChainTTL(),
            FateTypeMap(FateTypeString(), FateTypeAENSPointee())
        ]
    }]

    return FateTypeVariant(0, null, variants)
}

const FateTypeEvent = (variantType) => {
    return {
        name: 'event',
        variantType,
    }
}

const FateTypeBls12381Fr = () => {
    return {name: 'bls12_381.fr'}
}

const FateTypeBls12381Fp = () => {
    return {name: 'bls12_381.fp'}
}

module.exports = {
    FateTypeVoid,
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
    FateTypeSet,
    FateTypeMap,
    FateTypeVariant,
    FateTypeOption,
    FateTypeChainTTL,
    FateTypeChainGAMetaTx,
    FateTypeChainPayingForTx,
    FateTypeChainBaseTx,
    FateTypeAENSPointee,
    FateTypeAENSName,
    FateTypeEvent,
    FateTypeBls12381Fr,
    FateTypeBls12381Fp
}

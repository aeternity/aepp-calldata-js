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
    return {name: 'account_pubkey'}
}

const FateTypeContractAddress = () => {
    return {name: 'contract_pubkey'}
}

const FateTypeChannelAddress = () => {
    return {name: 'channel'}
}

const FateTypeOracleAddress = (questionType, answerType) => {
    return {
        name: 'oracle_pubkey',
        questionType,
        answerType
    }
}

const FateTypeOracleQueryAddress = (questionType, answerType) => {
    return {
        name: 'oracle_query_id',
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

const FateTypeVariant = (variants) => {
    return {
        name: 'variant',
        variants,
    }
}

const FateTypeType = (type) => {
    return {
        name: 'type',
        type,
    }
}

const FateTypeOption = (valueTypes) => {
    const variants = [
        { None: []},
        { Some: valueTypes }
    ]

    return FateTypeVariant(variants)
}

const FateTypeChainTTL = () => {
    const variants = [
        {RelativeTTL: [FateTypeInt()]},
        {FixedTTL: [FateTypeInt()]}
    ]

    return FateTypeVariant(variants)
}

const FateTypeChainGAMetaTx = () => {
    const variants = [
        {'Chain.GAMetaTx': [FateTypeAccountAddress(), FateTypeInt()]},
    ]

    return FateTypeVariant(variants)
}

const FateTypeChainPayingForTx = () => {
    const variants = [
        {'Chain.PayingForTx': [FateTypeAccountAddress(), FateTypeInt()]},
    ]

    return FateTypeVariant(variants)
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

    return FateTypeVariant(variants)
}

const FateTypeAENSPointee = () => {
    const variants = [
        {'AENS.AccountPt': [FateTypeAccountAddress()]},
        {'AENS.OraclePt': [FateTypeAccountAddress()]},
        {'AENS.ContractPt': [FateTypeAccountAddress()]},
        {'AENS.ChannelPt': [FateTypeAccountAddress()]},
    ]

    return FateTypeVariant(variants)
}

const FateTypeAENSName = () => {
    const variants = [{
        'AENS.Name': [
            FateTypeAccountAddress(),
            FateTypeChainTTL(),
            FateTypeMap(FateTypeString(), FateTypeAENSPointee())
        ]
    }]

    return FateTypeVariant(variants)
}

const FateTypeEvent = (variantType, topics) => {
    return {
        name: 'event',
        variantType,
        topics,
    }
}

const FateTypeBls12381Fr = () => {
    return {name: 'bls12_381.fr'}
}

const FateTypeBls12381Fp = () => {
    return {name: 'bls12_381.fp'}
}

const FateTypeCalldata = (functionName, argumentTypes) => {
    return {
        name: 'calldata',
        functionName,
        argumentTypes,
    }
}

const FateTypeVar = (id) => {
    return {
        name: 'tvar',
        id
    }
}

const FateTypeAny = () => {
    return {name: 'any'}
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
    FateTypeChannelAddress,
    FateTypeOracleAddress,
    FateTypeOracleQueryAddress,
    FateTypeByteArray,
    FateTypeList,
    FateTypeTuple,
    FateTypeRecord,
    FateTypeSet,
    FateTypeMap,
    FateTypeVariant,
    FateTypeType,
    FateTypeOption,
    FateTypeChainTTL,
    FateTypeChainGAMetaTx,
    FateTypeChainPayingForTx,
    FateTypeChainBaseTx,
    FateTypeAENSPointee,
    FateTypeAENSName,
    FateTypeEvent,
    FateTypeBls12381Fr,
    FateTypeBls12381Fp,
    FateTypeCalldata,
    FateTypeVar,
    FateTypeAny,
}

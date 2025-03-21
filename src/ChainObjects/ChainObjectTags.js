const ChainObjectTags = Object.freeze({
    ACCOUNT: 10,
    SIGNED_TX: 11,
    SPEND_TX: 12,
    ORACLE: 20,
    ORACLE_QUERY: 21,
    ORACLE_REGISTER_TX: 22,
    ORACLE_QUERY_TX: 23,
    ORACLE_RESPONSE_TX: 24,
    ORACLE_EXTEND_TX: 25,
    NAME: 30,
    NAME_COMMITMENT: 31,
    NAME_CLAIM_TX: 32,
    NAME_PRECLAIM_TX: 33,
    NAME_UPDATE_TX: 34,
    NAME_REVOKE_TX: 35,
    NAME_TRANSFER_TX: 36,
    NAME_AUCTION: 37,
    CONTRACT: 40,
    CONTRACT_CALL: 41,
    CONTRACT_CREATE_TX: 42,
    CONTRACT_CALL_TX: 43,
    CHANNEL_CREATE_TX: 50,
    CHANNEL_SET_DELEGATES_TX: 501,
    CHANNEL_DEPOSIT_TX: 51,
    CHANNEL_WITHDRAW_TX: 52,
    CHANNEL_FORCE_PROGRESS_TX: 521,
    CHANNEL_CLOSE_MUTUAL_TX: 53,
    CHANNEL_CLOSE_SOLO_TX: 54,
    CHANNEL_SLASH_TX: 55,
    CHANNEL_SETTLE_TX: 56,
    CHANNEL_OFFCHAIN_TX: 57,
    CHANNEL_OFFCHAIN_UPDATE_TRANSFER: 570,
    CHANNEL_OFFCHAIN_UPDATE_DEPOSIT: 571,
    CHANNEL_OFFCHAIN_UPDATE_WITHDRAW: 572,
    CHANNEL_OFFCHAIN_UPDATE_CREATE_CONTRACT: 573,
    CHANNEL_OFFCHAIN_UPDATE_CALL_CONTRACT: 574,
    CHANNEL_OFFCHAIN_UPDATE_META: 576,
    CHANNEL_CLIENT_RECONNECT_TX: 575,
    CHANNEL: 58,
    CHANNEL_SNAPSHOT_SOLO_TX: 59,
    TREES_POI: 60,
    TREES_DB: 61,
    STATE_TREES: 62,
    MTREE: 63,
    MTREE_VALUE: 64,
    CONTRACTS_MTREE: 621,
    CALLS_MTREE: 622,
    CHANNELS_MTREE: 623,
    NAMESERVICE_MTREE: 624,
    ORACLES_MTREE: 625,
    ACCOUNTS_MTREE: 626,
    COMPILER_SOPHIA: 70,
    GA_ATTACH_TX: 80,
    GA_META_TX: 81,
    PAYING_FOR_TX: 82,
    GA_META_TX_AUTH_DATA: 810,
    KEY_BLOCK: 100,
    MICRO_BLOCK_BODY: 101,
    LIGHT_MICRO_BLOCK: 102,
    POF: 200,
})

export default ChainObjectTags

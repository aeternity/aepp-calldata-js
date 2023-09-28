const ChainObjectTemplates = Object.freeze({
    ACCOUNT: {
        1: {
            nonce: 'int',
            balance: 'int',
        }
    },
    SIGNED_TX: {
        1: {
            signatures: ['signature'],
            transaction: 'chain_object',
        }
    },
    SPEND_TX: {
        1: {
            sender: 'id',
            recipient: 'id',
            amount: 'int',
            fee: 'int',
            ttl: 'int',
            nonce: 'int',
            payload: 'bytearray',
        }
    },
    LIGHT_MICRO_BLOCK: {
        5: {
            header: {
                type: 'object',
                template: {
                    version: 'uint_32', // protocol version?
                    flags: 'uint_32',
                    height: 'uint_64',
                    prevHash: 'micro_block_hash',
                    prevKeyHash: 'key_block_hash',
                    stateHash: 'block_state_hash',
                    txsHash: 'block_tx_hash',
                    time: 'uint_64',
                    // fraudHash: 'block_pof_hash',
                    signature: 'signature',
                }
            },
            txHashes: ['tx_hash'],
            pof: 'binary',
        }
    },
    MICRO_BLOCK_BODY: {
        5: {
            txs: ['chain_object'],
            pof: 'binary'
        }
    },
    MICRO_BLOCK: {
        5: {
            header: {
                type: 'object',
                template: {
                    version: 'uint_32',
                    flags: 'uint_32',
                    height: 'uint_64',
                    prevHash: 'micro_block_hash',
                    prevKeyHash: 'key_block_hash',
                    stateHash: 'block_state_hash',
                    txsHash: 'block_tx_hash',
                    time: 'uint_64',
                    // fraudHash: 'block_pof_hash',
                    signature: 'signature',
                }
            },
            body: 'chain_object'
        }
    },
    KEY_BLOCK: {
        1: {
            version: 'uint_32',
            flags: 'uint_32',
            height: 'uint_64',
            prevHash: 'micro_block_hash',
            prevKeyHash: 'key_block_hash',
            stateHash: 'block_state_hash',
            miner: 'account_pubkey',
            beneficiary: 'account_pubkey',
            target: 'uint_32',
            pow: 'pow',
            nonce: 'uint_64',
            time: 'uint_64',
        },
        5: {
            version: 'uint_32',
            flags: 'uint_32',
            height: 'uint_64',
            prevHash: 'micro_block_hash',
            prevKeyHash: 'key_block_hash',
            stateHash: 'block_state_hash',
            miner: 'account_pubkey',
            beneficiary: 'account_pubkey',
            target: 'uint_32',
            pow: 'pow',
            nonce: 'uint_64',
            time: 'uint_64',
            // binary, but currently interpreted as int/node version
            info: 'uint_32'
        }
    },
    COMPILER_SOPHIA: {
        3: {
            sourceHash: 'hex',
            typeInfo: [{
                hash: 'binary',
                name: 'binary',
                payable: 'bool',
                argType: 'binary',
                returnType: 'binary'
            }],
            byteCode: 'binary',
            compilerVersion: 'string',
            payable: 'bool'
        }
    }
})

module.exports = ChainObjectTemplates

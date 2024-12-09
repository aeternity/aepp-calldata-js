import test from './test.js'
import ChainObject from '../src/ChainObjects/ChainObject.js'
import ChainObjectSerializer from '../src/ChainObjects/ChainObjectSerializer.js'
import FieldEncoder from '../src/ChainObjects/FieldEncoder.js'
import FieldsEncoder from '../src/ChainObjects/FieldsEncoder.js'

const serializer = new ChainObjectSerializer(new FieldsEncoder(new FieldEncoder()))

test('Serialize Account', t => {
    t.plan(2)

    t.deepEqual(
        serializer.serialize(new ChainObject('account', {balance: 0n, nonce: 0n})),
        new Uint8Array([196, 10, 1, 0, 0])
    )

    t.deepEqual(
        serializer.serialize(new ChainObject('account', {balance: 69n, nonce: 7n})),
        new Uint8Array([196, 10, 1, 7, 69])
    )
})

test('Deserialize Account', t => {
    t.plan(2)

    t.deepEqual(
        serializer.deserialize(new Uint8Array([196, 10, 1, 0, 0])),
        new ChainObject('account', {balance: 0n, nonce: 0n}),
    )

    t.deepEqual(
        serializer.deserialize(new Uint8Array([196, 10, 1, 7, 69])),
        new ChainObject('account', {balance: 69n, nonce: 7n}),
    )
})

test('Serialize SpendTx', t => {
    t.plan(1)
    t.deepEqual(
        serializer.serialize(new ChainObject('spend_tx', {
            sender: 'ak_11111111111111111111111111111118qjnEr',
            recipient: 'ak_1111111111111111111111111111111Hrt6FG',
            amount: 1n,
            fee: 1n,
            ttl: 0n,
            nonce: 1n,
            payload: 'ba_Xfbg4g==',
        })),
        new Uint8Array([
            248, 75, 12, 1, 161, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 161, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 0, 1, 128
        ])
    )
})

test('Deserialize SpendTx', t => {
    t.plan(1)
    t.deepEqual(
        serializer.deserialize(new Uint8Array([
            248, 75, 12, 1, 161, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 161, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 0, 1, 128
        ])),
        new ChainObject('spend_tx', {
            sender: 'ak_11111111111111111111111111111118qjnEr',
            recipient: 'ak_1111111111111111111111111111111Hrt6FG',
            amount: 1n,
            fee: 1n,
            ttl: 0n,
            nonce: 1n,
            payload: 'ba_Xfbg4g==',
        }),
    )
})

const signedTx = new ChainObject('signed_tx', {
    transaction: new ChainObject('spend_tx', {
        amount: 20000n,
        fee: 19300000000000n,
        nonce: 9027134n,
        payload: 'ba_NzY2NzY5OmtoX2NNaERKdEQ2TXp1WWN4U2RmclY4ZnlLMVczdTFkdG96THBMa0pqVVZxcjlpM2VmczE6bWhfeE1hYjNNUGVtTGkzREpReHRaV25ZTHp4WGJYWXEzZ1pkY25BTkpVOGlhVk1IcGQ5NjoxNjgyNDExNDAwEsem0g==',
        recipient: 'ak_2nF3Lh7djksbWLzXoNo6x59hnkyBezK8yjR53GPFgha3VdM1K8',
        sender: 'ak_2nF3Lh7djksbWLzXoNo6x59hnkyBezK8yjR53GPFgha3VdM1K8',
        ttl: 766779n,
    }),
    signatures: ['sg_aCYXPaanvbRGNxK6n2UcYv2WxpU8uPEAN7KTK7xWZV8A94WusQCWwcSSgKweRspaEtcygaoRkQ9u7n2s2mcgknxZYJ96V']
})

const signedTxData = new Uint8Array([
    249, 1, 31, 11, 1, 248, 66, 184, 64, 253, 194, 139,
    240, 16, 159, 222, 79, 103, 182, 9, 225, 200, 99, 135,
    77, 49, 164, 79, 188, 175, 148, 205, 219, 37, 14, 248,
    28, 254, 12, 1, 40, 246, 170, 250, 122, 96, 135, 165,
    115, 71, 69, 115, 35, 69, 63, 127, 253, 52, 183, 115,
    197, 9, 68, 53, 204, 140, 246, 51, 43, 231, 53, 48,
    12, 184, 215, 248, 213, 12, 1, 161, 1, 234, 108, 123,
    148, 81, 247, 177, 44, 175, 199, 65, 254, 34, 194, 169,
    172, 35, 70, 135, 146, 156, 22, 7, 104, 16, 11, 42,
    67, 76, 117, 41, 3, 161, 1, 234, 108, 123, 148, 81,
    247, 177, 44, 175, 199, 65, 254, 34, 194, 169, 172, 35,
    70, 135, 146, 156, 22, 7, 104, 16, 11, 42, 67, 76,
    117, 41, 3, 130, 78, 32, 134, 17, 141, 161, 164, 232,
    0, 131, 11, 179, 59, 131, 137, 190, 62, 184, 123, 55,
    54, 54, 55, 54, 57, 58, 107, 104, 95, 99, 77, 104,
    68, 74, 116, 68, 54, 77, 122, 117, 89, 99, 120, 83,
    100, 102, 114, 86, 56, 102, 121, 75, 49, 87, 51, 117,
    49, 100, 116, 111, 122, 76, 112, 76, 107, 74, 106, 85,
    86, 113, 114, 57, 105, 51, 101, 102, 115, 49, 58, 109,
    104, 95, 120, 77, 97, 98, 51, 77, 80, 101, 109, 76,
    105, 51, 68, 74, 81, 120, 116, 90, 87, 110, 89, 76,
    122, 120, 88, 98, 88, 89, 113, 51, 103, 90, 100, 99,
    110, 65, 78, 74, 85, 56, 105, 97, 86, 77, 72, 112,
    100, 57, 54, 58, 49, 54, 56, 50, 52, 49, 49, 52,
    48, 48
])

test('Serialize SignedTx', t => {
    t.plan(1)
    t.deepEqual(
        serializer.serialize(signedTx),
        signedTxData
    )
})

test('Deserialize SignedTx', t => {
    t.plan(1)
    t.deepEqual(
        serializer.deserialize(signedTxData),
        signedTx
    )
})

const lightMicroBlock = new ChainObject(
    'light_micro_block',
    {
        header: {
            version: 5n,
            flags: 0n,
            height: 766360n,
            prevHash: 'mh_2PQiVSEG1Yhjc9mNZxdjEEHoSaeSptXPJ9RV8VcMHuB59zxwGJ',
            prevKeyHash: 'kh_oakHZhkqsPWGdF7y5xUhPHYUEsgUqUJ1bqtauktFrhsm2rsgZ',
            stateHash: 'bs_21KHSDxPEqGJ7KRnA9KnHVZCcTyoNPK4H6EccLvbpfRs9NbDRS',
            txsHash: 'bx_2c3zuFEBtZHFhiF4eYa83b393gdrC6WNG4aiFwV6fHNSx74c2U',
            time: 1682334788843n,
            signature: 'sg_AWCMTjMCMKiBg4e952cf6eSqxWhtsBzbykPwS4tadEszcTfBHEeNwRziaG413EL88xJ9iViTLMX6aDnsZuKmPfQwQKtcV'
        },
        txHashes: [
            'th_kofhMb8n4JNtaRJQt4i1dwHXFkC6ot9Q3bFfKNRvoHJR2vycJ'
        ],
        pof: [],
    }
)

const lightMicroBlockData = new Uint8Array([
    248, 255, 102, 5, 184, 216, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 177,
    152, 182, 148, 5, 159, 169, 124, 30, 142, 164, 157, 208, 64, 190, 205,
    157, 82, 45, 240, 243, 244, 208, 84, 47, 13, 125, 18, 54, 101, 246,
    178, 14, 242, 105, 197, 14, 84, 84, 48, 248, 195, 37, 214, 221, 22,
    172, 48, 15, 200, 37, 79, 38, 127, 230, 6, 44, 76, 54, 149, 62, 88, 123,
    123, 160, 227, 132, 105, 111, 241, 174, 219, 181, 152, 8, 223, 253,
    255, 131, 37, 26, 204, 46, 152, 107, 81, 156, 56, 174, 203, 198, 181,
    25, 227, 246, 91, 203, 47, 211, 73, 6, 137, 70, 7, 78, 103, 120, 80, 54,
    100, 111, 133, 46, 20, 96, 175, 10, 134, 70, 146, 157, 231, 164, 50,
    76, 191, 150, 169, 139, 57, 0, 0, 1, 135, 178, 247, 172, 235, 72, 163,
    212, 85, 197, 154, 197, 196, 117, 92, 110, 49, 52, 192, 141, 164, 32,
    72, 120, 128, 72, 49, 105, 113, 60, 228, 94, 230, 11, 165, 130, 12, 62,
    106, 143, 44, 44, 41, 27, 62, 246, 152, 95, 24, 22, 90, 251, 118, 200,
    250, 210, 86, 15, 247, 124, 216, 128, 55, 127, 181, 134, 216, 79, 15,
    225, 160, 99, 118, 182, 48, 73, 150, 253, 231, 109, 16, 169, 250, 154,
    181, 1, 110, 102, 135, 150, 233, 134, 27, 89, 202, 221, 31, 205, 207,
    196, 7, 203, 92, 192
])

test('Serialize Light MicroBlock', t => {
    t.plan(1)
    t.deepEqual(
        serializer.serialize(lightMicroBlock),
        lightMicroBlockData
    )
})

test('Deserialize Light MicroBlock', t => {
    t.plan(1)
    t.deepEqual(
        serializer.deserialize(lightMicroBlockData),
        lightMicroBlock
    )
})

const contractData = new Uint8Array([
    248, 114, 70, 3, 160, 144, 2, 203, 30, 239, 26, 171,
    141, 199, 191, 152, 59, 237, 121, 38, 75, 206, 160, 74,
    96, 79, 9, 108, 232, 235, 229, 249, 64, 98, 98, 163,
    200, 192, 184, 69, 169, 254, 68, 214, 68, 31, 0, 55,
    0, 55, 0, 26, 14, 130, 17, 116, 101, 115, 116, 26,
    14, 132, 17, 101, 99, 104, 111, 1, 3, 63, 254, 98,
    168, 180, 140, 4, 55, 0, 7, 1, 3, 4, 151, 47,
    2, 17, 68, 214, 68, 31, 17, 105, 110, 105, 116, 17,
    98, 168, 180, 140, 21, 116, 101, 115, 116, 50, 130, 47,
    0, 133, 54, 46, 49, 46, 48, 1
])
const contract = new ChainObject('compiler_sophia', {
    vsn: 3n,
    sourceHash: '9002cb1eef1aab8dc7bf983bed79264bcea04a604f096ce8ebe5f9406262a3c8',
    compilerVersion: '6.1.0',
    payable: true,
    typeInfo: [],
    byteCode: new Uint8Array([
        169, 254, 68, 214, 68, 31, 0, 55, 0, 55, 0, 26,
        14, 130, 17, 116, 101, 115, 116, 26, 14, 132, 17, 101,
        99, 104, 111, 1, 3, 63, 254, 98, 168, 180, 140, 4,
        55, 0, 7, 1, 3, 4, 151, 47, 2, 17, 68, 214,
        68, 31, 17, 105, 110, 105, 116, 17, 98, 168, 180, 140,
        21, 116, 101, 115, 116, 50, 130, 47, 0
    ])
})

test('Serialize contract', t => {
    t.plan(1)

    t.deepEqual(
        serializer.serialize(contract),
        contractData
    )
})

test('Deserialize contract', t => {
    t.plan(1)

    t.deepEqual(
        serializer.deserialize(contractData),
        contract
    )
})

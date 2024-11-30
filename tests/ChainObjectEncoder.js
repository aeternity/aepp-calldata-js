import test from './test.js'
import ChainObject from '../src/ChainObjects/ChainObject.js'
import ChainObjectEncoder from '../src/ChainObjects/ChainObjectEncoder.js'
import FieldEncoder from '../src/ChainObjects/FieldEncoder.js'
import FieldsEncoder from '../src/ChainObjects/FieldsEncoder.js'

const encoder = new ChainObjectEncoder(new FieldsEncoder(new FieldEncoder()))

const microBlock = new ChainObject(
    'micro_block',
    {
        header: {
            version: 5n,
            flags: 0n,
            height: 766360n,
            prevHash: 'mh_2PQiVSEG1Yhjc9mNZxdjEEHoSaeSptXPJ9RV8VcMHuB59zxwGJ',
            prevKeyHash: 'kh_oakHZhkqsPWGdF7y5xUhPHYUEsgUqUJ1bqtauktFrhsm2rsgZ',
            stateHash: 'bs_21KHSDxPEqGJ7KRnA9KnHVZCcTyoNPK4H6EccLvbpfRs9NbDRS',
            txsHash: 'bx_2c3zuFEBtZHFhiF4eYa83b393gdrC6WNG4aiFwV6fHNSx74c2U',
            signature: 'sg_AR7Br6Jc8hoA1Xm2rTTPVA82xMQcngiXXB8wj3Nt6NpjShJ55XzLqrD6BPMnwLS9CRrkzpSku3P2d4efGipK5RKTUZXTm',
            time: 1682334788843n
        },
        body: new ChainObject('micro_block_body', {
            vsn: 5n,
            txs: [
                new ChainObject('signed_tx', {
                    signatures: [],
                    transaction: new ChainObject('spend_tx', {
                        sender: 'ak_2nF3Lh7djksbWLzXoNo6x59hnkyBezK8yjR53GPFgha3VdM1K8',
                        recipient: 'ak_2nF3Lh7djksbWLzXoNo6x59hnkyBezK8yjR53GPFgha3VdM1K8',
                        amount: 20000n,
                        fee: 19300000000000n,
                        ttl: 0n,
                        nonce: 9027134n,
                        payload: 'ba_NzY2NzY5OmtoX2NNaERKdEQ2TXp1WWN4U2RmclY4ZnlLMVczdTFkdG96THBMa0pqVVZxcjlpM2VmczE6bWhfeE1hYjNNUGVtTGkzREpReHRaV25ZTHp4WGJYWXEzZ1pkY25BTkpVOGlhVk1IcGQ5NjoxNjgyNDExNDAwEsem0g=='
                    })
                })
            ],
            pof: [],
        })
    }
)

const microBlockData = new Uint8Array([
    0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 177, 152, 182, 148, 5, 159, 169,
    124, 30, 142, 164, 157, 208, 64, 190, 205, 157, 82, 45, 240, 243, 244,
    208, 84, 47, 13, 125, 18, 54, 101, 246, 178, 14, 242, 105, 197, 14, 84,
    84, 48, 248, 195, 37, 214, 221, 22, 172, 48, 15, 200, 37, 79, 38, 127,
    230, 6, 44, 76, 54, 149, 62, 88, 123, 123, 160, 227, 132, 105, 111,
    241, 174, 219, 181, 152, 8, 223, 253, 255, 131, 37, 26, 204, 46, 152,
    107, 81, 156, 56, 174, 203, 198, 181, 25, 227, 246, 91, 203, 47, 211,
    73, 6, 137, 70, 7, 78, 103, 120, 80, 54, 100, 111, 133, 46, 20, 96, 175,
    10, 134, 70, 146, 157, 231, 164, 50, 76, 191, 150, 169, 139, 57, 0, 0,
    1, 135, 178, 247, 172, 235, 71, 248, 35, 108, 21, 241, 167, 185, 40,
    49, 47, 14, 37, 170, 218, 247, 146, 114, 252, 127, 162, 28, 185, 23,
    43, 71, 180, 4, 55, 102, 164, 37, 106, 194, 58, 60, 83, 146, 77, 75, 68,
    230, 101, 59, 234, 49, 138, 202, 9, 156, 209, 132, 88, 88, 183, 171,
    192, 68, 91, 44, 28, 162, 253, 10,
    // end of header
    248, 226, 101, 5, 248, 221, 184,
    219, 248, 217, 11, 1, 192, 184, 212, 248, 210, 12, 1, 161, 1, 234, 108,
    123, 148, 81, 247, 177, 44, 175, 199, 65, 254, 34, 194, 169, 172, 35,
    70, 135, 146, 156, 22, 7, 104, 16, 11, 42, 67, 76, 117, 41, 3, 161, 1,
    234, 108, 123, 148, 81, 247, 177, 44, 175, 199, 65, 254, 34, 194, 169,
    172, 35, 70, 135, 146, 156, 22, 7, 104, 16, 11, 42, 67, 76, 117, 41, 3,
    130, 78, 32, 134, 17, 141, 161, 164, 232, 0, 0, 131, 137, 190, 62, 184,
    123, 55, 54, 54, 55, 54, 57, 58, 107, 104, 95, 99, 77, 104, 68, 74, 116,
    68, 54, 77, 122, 117, 89, 99, 120, 83, 100, 102, 114, 86, 56, 102, 121,
    75, 49, 87, 51, 117, 49, 100, 116, 111, 122, 76, 112, 76, 107, 74, 106,
    85, 86, 113, 114, 57, 105, 51, 101, 102, 115, 49, 58, 109, 104, 95,
    120, 77, 97, 98, 51, 77, 80, 101, 109, 76, 105, 51, 68, 74, 81, 120,
    116, 90, 87, 110, 89, 76, 122, 120, 88, 98, 88, 89, 113, 51, 103, 90,
    100, 99, 110, 65, 78, 74, 85, 56, 105, 97, 86, 77, 72, 112, 100, 57, 54,
    58, 49, 54, 56, 50, 52, 49, 49, 52, 48, 48, 192
])

test('Encode MicroBlock Object', t => {
    t.plan(1)
    // console.dir(encoder.encode(microBlock), {maxArrayLength: null})
    t.deepEqual(
        encoder.encode(microBlock),
        microBlockData
    )
})

test('Decode MicroBlock Object', t => {
    t.plan(1)
    t.deepEqual(
        encoder.decode('micro_block', microBlockData),
        microBlock
    )
})

const keyBlock = new ChainObject(
    'key_block',
    {
        version: 5n,
        flags: 3221225472n,
        height: 767477n,
        prevHash: 'mh_2cty9YZ1QikpU9yQ3KBsPAGoXiqkSsdhAGAVZhV2eJ76ct1eWD',
        prevKeyHash: 'kh_rVfiLy7etewiFM3pRU5uAh2Has9m7HMYJH1psPYZHWQdDbi3b',
        stateHash: 'bs_SuaTBC7gRFdbsgAvKJ1p4irvHfcbttovoLfqkmdSxi3mHND5y',
        miner: 'ak_25LNFMwQTijP3UWv53WvmLLgNUxcpiqteJ5dgJaHfQHXe1n8KH',
        beneficiary: 'ak_2iBPH7HUz3cSDVEUWiHg76MZJ6tZooVNBmmxcgVK6VV8KAE688',
        target: 553713663n,
        pow: new Uint8Array(new Array(168).fill(0)),
        nonce: 16763573506821029832n,
        time: 1682683859810n,
        info: 690n,
    }
)

const keyBlockData = new Uint8Array([
    0, 0, 0, 5, 192, 0, 0, 0, 0, 0, 0, 0, 0, 11, 181, 245, 213, 51, 205, 168, 8,
    248, 88, 254, 15, 86, 154, 248, 207, 16, 87, 40, 15, 41, 144, 18, 92,
    151, 40, 64, 132, 149, 125, 94, 42, 158, 181, 86, 112, 97, 254, 85,
    187, 122, 167, 155, 35, 70, 15, 210, 159, 255, 80, 30, 164, 185, 140,
    18, 72, 84, 141, 0, 120, 4, 196, 116, 72, 243, 64, 2, 58, 210, 232, 251,
    225, 225, 98, 183, 95, 249, 106, 74, 207, 207, 31, 232, 54, 195, 214,
    21, 245, 193, 99, 128, 148, 90, 3, 122, 146, 150, 209, 175, 141, 137,
    104, 128, 232, 115, 19, 76, 25, 22, 129, 151, 229, 172, 44, 46, 84,
    117, 106, 12, 246, 192, 13, 189, 8, 77, 176, 0, 109, 136, 244, 250,
    225, 50, 184, 241, 221, 183, 160, 78, 99, 183, 250, 150, 71, 154, 84,
    187, 197, 37, 165, 49, 167, 241, 188, 12, 228, 146, 18, 25, 3, 6, 127,
    176, 33, 0, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 232, 164, 45, 73, 136, 55, 127, 200, 0, 0, 1,
    135, 199, 198, 19, 98, 0, 0, 2, 178
])

test('Encode KeyBlock Object', t => {
    t.plan(1)
    t.deepEqual(
        encoder.encode(keyBlock),
        keyBlockData
    )
})

test('Decode KeyBlock Object', t => {
    t.plan(1)
    t.deepEqual(
        encoder.decode('key_block', keyBlockData),
        keyBlock
    )
})

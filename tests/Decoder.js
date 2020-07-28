const fs = require('fs')
const test = require('ava');
const Encoder = require('../src/Encoder.js')
const HexStringToByteArray = require('../src/utils/HexStringToByteArray.js')
const FateInt = require('../src/types/FateInt.js')
const FateList = require('../src/types/FateList.js')
const FateBits = require('../src/types/FateBits.js')
const FateTuple = require('../src/types/FateTuple.js')
const FateBool = require('../src/types/FateBool.js')
const FateMap = require('../src/types/FateMap.js')
const FateVariant = require('../src/types/FateVariant.js')
const FateString = require('../src/types/FateString.js')
const {
    FateTypeBool,
    FateTypeInt,
    FateTypeList,
    FateTypeMap,
    FateTypeString
} = require('../src/FateTypes.js')

const CONTRACT = 'Test'

const FTInt = FateTypeInt()
const FTBool = FateTypeBool()

test.before(async t => {
    const aci = JSON.parse(fs.readFileSync('build/contracts/Test.json', 'utf-8'))
    const encoder = new Encoder(aci)

    t.context.encoder = encoder
});

test('Decode boolean return', t => {
    t.is(
        t.context.encoder.decode(CONTRACT, 'test_bool', 'cb_/8CwV/U='),
        true
    )
});

test('Decode int return', t => {
    t.is(
        t.context.encoder.decode(CONTRACT, 'test_single_int', 'cb_b4MC7W/bKkpn'),
        191919n,
        'test_single_int(191919)'
    )
});

test('Decode bytes return', t => {
    t.deepEqual(
        t.context.encoder.decode(CONTRACT, 'test_bytes', 'cb_nwEJvu+rlRrs'),
        new Uint8Array([0xbe, 0xef]),
        'test_bytes(#beef)'
    )
});

test('Decode string return', t => {
    t.deepEqual(
        t.context.encoder.decode(CONTRACT, 'test_string', 'cb_KXdob29seW1vbHlGazSE'),
        "whoolymoly",
        'test_string("whoolymoly")'
    )
});

test('Decode hash return', t => {
    t.deepEqual(
        t.context.encoder.decode(
            CONTRACT,
            'test_hash',
            'cb_nwGBAAECAwQFBgcICQoLDA0ODwABAgMEBQYHCAkKCwwNDg/55Yfk',
        ),
        HexStringToByteArray("0x000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f"),
        'test_hash(#000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f)'
    )
});

test('Decode signature return', t => {
    t.deepEqual(
        t.context.encoder.decode(
            CONTRACT,
            'test_signature',
            'cb_nwEBAAABAgMEBQYHCAkKCwwNDg8AAQIDBAUGBwgJCgsMDQ4PAAECAwQFBgcICQoLDA0ODwABAgMEBQYHCAkKCwwNDg/EV2+8',
        ),
        HexStringToByteArray("0x000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f"),
        `test_signature(
            #000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f
            000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f
        )`
    )
});

test('Decode account address return', t => {
    t.deepEqual(
        t.context.encoder.decode(
            CONTRACT,
            'test_account_address',
            'cb_nwCg3mi/4bID5R9SNRugh/ebeCjmoUDwwxSmcMcAOz/1cHVYbXWK'
        ),
        HexStringToByteArray("0xDE68BFE1B203E51F52351BA087F79B7828E6A140F0C314A670C7003B3FF57075"),
        'test_account_address(ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt)'
    )
});

test('Decode contract address return', t => {
    t.deepEqual(
        t.context.encoder.decode(
            CONTRACT,
            'test_contract_address',
            'cb_nwKgH8DQmexaE8uTKKMX/OzYUrH3SJ5eALoJVzw8LbaYVVPlirXw',
        ),
        HexStringToByteArray("0x1FC0D099EC5A13CB9328A317FCECD852B1F7489E5E00BA09573C3C2DB6985553"),
        'test_contract_address(ct_Ez6MyeTMm17YnTnDdHTSrzMEBKmy7Uz2sXu347bTDPgVH2ifJ)'
    )
});

test('Decode oracle address return', t => {
    t.deepEqual(
        t.context.encoder.decode(
            CONTRACT,
            'test_oracle_address',
            'cb_nwOgyvIqJE7awD0m8CoX2SOULQVc/IYjKLJaUcKEvJ1CDkkkbvWd'
        ),
        HexStringToByteArray("0xCAF22A244EDAC03D26F02A17D923942D055CFC862328B25A51C284BC9D420E49"),
        'test_oracle_address(ok_2YNyxd6TRJPNrTcEDCe9ra59SVUdp9FR9qWC5msKZWYD9bP9z5)'
    )
});

test('Decode oracle query address return', t => {
    t.deepEqual(
        t.context.encoder.decode(
            CONTRACT,
            'test_oracle_query_address',
            'cb_nwSg7R7n3AJ40FzpUJRzxQqT1Dooso1QMvbffapEL+E3E0g6bqyq',
        ),
        HexStringToByteArray("0xED1EE7DC0278D05CE9509473C50A93D43A28B28D5032F6DF7DAA442FE1371348"),
        'test_oracle_query_address(oq_2oRvyowJuJnEkxy58Ckkw77XfWJrmRgmGaLzhdqb67SKEL1gPY)'
    )
});

test('Decode bits return', t => {
    const decoded = t.context.encoder.decode(CONTRACT, 'test_bits', 'cb_TwBixWzt')
    t.deepEqual(decoded, 0b0n, 'test_bits(Bits.none)')

    const decoded2 = t.context.encoder.decode(CONTRACT, 'test_bits', 'cb_zwH34yVW')
    t.deepEqual(decoded2, -1n, 'test_bits(Bits.all)')

    const decoded3 = t.context.encoder.decode(CONTRACT, 'test_bits', 'cb_TwEPbJQb')
    t.deepEqual(decoded3, 0b00000001n, 'test_bits(Bits.set(Bits.none, 0)')
});

test('Decode list arguments', t => {
    const decoded = t.context.encoder.decode(CONTRACT, 'test_list', 'cb_cwIEBgoQGiqNmBRX')
    const ints = [1, 2, 3, 5, 8, 13, 21].map(i => new FateInt(i))

    t.deepEqual(decoded, new FateList(FateTypeInt(), ints), 'test_list([1, 2, 3, 5, 8, 13, 21])')
});

test('Decode nested list arguments', t => {
    const decoded = t.context.encoder.decode(CONTRACT, 'test_nested_list', 'cb_MyMCBCMGCCMKDPLAUC0=')
    const ints = [
        new FateList(FateTypeInt(), [new FateInt(1), new FateInt(2)]),
        new FateList(FateTypeInt(), [new FateInt(3), new FateInt(4)]),
        new FateList(FateTypeInt(), [new FateInt(5), new FateInt(6)])
    ]

    t.deepEqual(decoded, new FateList(FateTypeList(FateTypeInt()), ints), 'test_nested_list([[1,2],[3,4],[5,6]])')
});

test('Decode tuple arguments', t => {
    t.deepEqual(
        t.context.encoder.decode(CONTRACT, 'test_tuple', 'cb_K/9/fDzeoA=='),
        new FateTuple(
            [FateTypeBool(), FateTypeBool()],
            [new FateBool(true), new FateBool(false)]
        ),
        'test_tuple((true, false))'
    )
});

test('Decode nested tuple arguments', t => {
    const t1 = new FateTuple(
        [FateTypeBool(), FateTypeBool()],
        [new FateBool(true), new FateBool(false)]
    )
    const t2 = new FateTuple(
        [FateTypeBool(), FateTypeBool()],
        [new FateBool(false), new FateBool(true)]
    )

    t.deepEqual(
        t.context.encoder.decode(CONTRACT, 'test_nested_tuple', 'cb_Kyv/fyt//701yEI='),
        new FateTuple(
            [t1.type, t2.type],
            [t1, t2]
        ),
        'test_nested_tuple(((true, false), (false true)))'
    )
});

test('Decode map arguments', t => {
    t.deepEqual(
        t.context.encoder.decode(CONTRACT, 'test_simple_map', 'cb_LwEOfzGit9U='),
        new FateMap(FateTypeInt(), FateTypeBool(), [[new FateInt(7), new FateBool(false)]]),
        'test_simple_map({[7] = false})'
    )
});

test('Decode nested map arguments', t => {
    t.deepEqual(
        t.context.encoder.decode(CONTRACT, 'test_nested_map', 'cb_LwMALwEAfwIvAQL/BC8BEP8Q+3ou'),
        new FateMap(
            FTInt,
            FateTypeMap(FTInt, FTBool),
            [
                [new FateInt(0), new FateMap(
                    FTInt, FTBool, [[new FateInt(0), new FateBool(false)]])
                ],
                [new FateInt(1), new FateMap(
                    FTInt, FTBool, [[new FateInt(1), new FateBool(true)]])
                ],
                [new FateInt(2), new FateMap(
                    FTInt, FTBool, [[new FateInt(8), new FateBool(true)]])
                ],
            ]
        ),
        'test_nested_map({[0] = {[0] = false}, [1] = {[1] = true}, [2] = {[8] = true}})'
    )
});

test('Decode simple variant arguments', t => {
    t.deepEqual(
        t.context.encoder.decode(
            CONTRACT,
            'test_variants',
            'cb_r4QAAAEAAT8xtJ9f'
        ),
        new FateVariant([0, 0, 1, 0], 1),
        'test_variants(No)'
    )
});

test('Decode variant arguments with non-zero arity', t => {
    t.deepEqual(
        t.context.encoder.decode(
            CONTRACT,
            'test_variants',
            'cb_r4QAAAEAAhsOfGqVXg=='
        ),
        new FateVariant([0, 0, 1, 0], 2, [new FateInt(7)], [FTInt]),
        'test_variants(Yep(7))'
    )
});

test('Decode variant with template arguments', t => {
    t.deepEqual(
        t.context.encoder.decode(
            CONTRACT,
            'test_template_variants',
            'cb_r4IABAFLDv8SKhktM40=',
        ),
        new FateVariant(
            [0, 4],
            1,
            [new FateInt(7), new FateBool(true), new FateInt(9), new FateInt(21)],
            [FTInt, FTBool, FTInt, FTInt]
        ),
        'test_template_variants(Any(7, true, 9, 21))'
    )
});

test('Decode type aliases', t => {
    t.is(
        t.context.encoder.decode(CONTRACT, 'test_int_type', 'cb_DtbN98k='),
        7n,
        'test_int_type(7)'
    )

    t.deepEqual(
        t.context.encoder.decode(CONTRACT, 'test_map_type', 'cb_LwENZm9vJjJRlLM='),
        new FateMap(FateTypeString(), FTInt, [[new FateString("foo"), new FateInt(19)]]),
        'test_map_type({["foo"] = 19})'
    )
});

test('Decode template type', t => {
    t.is(
        t.context.encoder.decode(
            CONTRACT,
            'test_template_type',
            'cb_DtbN98k='
        ),
        7n,
        'test_template_type(7)'
    )
});

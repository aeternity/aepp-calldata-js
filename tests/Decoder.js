const test = require('./test')
const Encoder = require('../src/Encoder')
const HexStringToByteArray = require('../src/utils/HexStringToByteArray')
const aci = require('../build/contracts/Test.json')

const CONTRACT = 'Test'
const encoder = new Encoder(aci)

test('Decode implicit init (void)', t => {
    t.plan(1)
    t.is(
        encoder.decode(CONTRACT, 'init', 'cb_/8CwV/U='),
        undefined
    )
})

test('Decode unit return', t => {
    t.plan(1)
    t.deepEqual(
        encoder.decode(CONTRACT, 'test_unit', 'cb_P4fvHVw='),
        [] // ()
    )
})

test('Decode boolean return', t => {
    t.plan(1)
    t.is(
        encoder.decode(CONTRACT, 'test_bool', 'cb_/8CwV/U='),
        true
    )
})

test('Decode int return', t => {
    t.plan(1)
    t.is(
        encoder.decode(CONTRACT, 'test_single_int', 'cb_b4MC7W/bKkpn'),
        191919n,
        'test_single_int(191919)'
    )
})

test('Decode bytes return', t => {
    t.plan(1)
    t.deepEqual(
        encoder.decode(CONTRACT, 'test_bytes', 'cb_nwEJvu+rlRrs'),
        new Uint8Array([0xbe, 0xef]),
        'test_bytes(#beef)'
    )
})

test('Decode string return', t => {
    t.plan(1)
    t.deepEqual(
        encoder.decode(CONTRACT, 'test_string', 'cb_KXdob29seW1vbHlGazSE'),
        "whoolymoly",
        'test_string("whoolymoly")'
    )
})

test('Decode hash return', t => {
    t.plan(1)
    t.deepEqual(
        encoder.decode(
            CONTRACT,
            'test_hash',
            'cb_nwGBAAECAwQFBgcICQoLDA0ODwABAgMEBQYHCAkKCwwNDg/55Yfk',
        ),
        HexStringToByteArray("0x000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f"),
        'test_hash(#000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f)'
    )
})

test('Decode signature return', t => {
    t.plan(1)
    t.deepEqual(
        encoder.decode(
            CONTRACT,
            'test_signature',
            'cb_nwEBAAABAgMEBQYHCAkKCwwNDg8AAQIDBAUGBwgJCgsMDQ4PAAECAwQFBgcICQoLDA0ODwABAgMEBQYHCAkKCwwNDg/EV2+8',
        ),
        HexStringToByteArray("0x000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f"),
        `test_signature(#000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f)`
    )
})

test('Decode account address return', t => {
    t.plan(1)
    t.deepEqual(
        encoder.decode(
            CONTRACT,
            'test_account_address',
            'cb_nwCg3mi/4bID5R9SNRugh/ebeCjmoUDwwxSmcMcAOz/1cHVYbXWK'
        ),
        'ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt',
        'test_account_address(ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt)'
    )
})

test('Decode contract address return', t => {
    t.plan(1)
    t.deepEqual(
        encoder.decode(
            CONTRACT,
            'test_contract_address',
            'cb_nwKgH8DQmexaE8uTKKMX/OzYUrH3SJ5eALoJVzw8LbaYVVPlirXw',
        ),
        'ct_Ez6MyeTMm17YnTnDdHTSrzMEBKmy7Uz2sXu347bTDPgVH2ifJ',
        'test_contract_address(ct_Ez6MyeTMm17YnTnDdHTSrzMEBKmy7Uz2sXu347bTDPgVH2ifJ)'
    )
})

test('Decode oracle address return', t => {
    t.plan(1)
    t.deepEqual(
        encoder.decode(
            CONTRACT,
            'test_oracle_address',
            'cb_nwOgyvIqJE7awD0m8CoX2SOULQVc/IYjKLJaUcKEvJ1CDkkkbvWd'
        ),
        'ok_2YNyxd6TRJPNrTcEDCe9ra59SVUdp9FR9qWC5msKZWYD9bP9z5',
        'test_oracle_address(ok_2YNyxd6TRJPNrTcEDCe9ra59SVUdp9FR9qWC5msKZWYD9bP9z5)'
    )
})

test('Decode oracle query address return', t => {
    t.plan(1)
    t.deepEqual(
        encoder.decode(
            CONTRACT,
            'test_oracle_query_address',
            'cb_nwSg7R7n3AJ40FzpUJRzxQqT1Dooso1QMvbffapEL+E3E0g6bqyq',
        ),
        'oq_2oRvyowJuJnEkxy58Ckkw77XfWJrmRgmGaLzhdqb67SKEL1gPY',
        'test_oracle_query_address(oq_2oRvyowJuJnEkxy58Ckkw77XfWJrmRgmGaLzhdqb67SKEL1gPY)'
    )
})

test('Decode bits return', t => {
    t.plan(3)
    const decoded = encoder.decode(CONTRACT, 'test_bits', 'cb_TwBixWzt')
    t.deepEqual(decoded, 0b0n, 'test_bits(Bits.none)')

    const decoded2 = encoder.decode(CONTRACT, 'test_bits', 'cb_zwH34yVW')
    t.deepEqual(decoded2, -1n, 'test_bits(Bits.all)')

    const decoded3 = encoder.decode(CONTRACT, 'test_bits', 'cb_TwEPbJQb')
    t.deepEqual(decoded3, 0b00000001n, 'test_bits(Bits.set(Bits.none, 0)')
})

test('Decode list arguments', t => {
    t.plan(1)
    const decoded = encoder.decode(CONTRACT, 'test_list', 'cb_cwIEBgoQGiqNmBRX')
    const ints = [1, 2, 3, 5, 8, 13, 21].map(i => BigInt(i))

    t.deepEqual(decoded, ints, 'test_list([1, 2, 3, 5, 8, 13, 21])')
})

test('Decode long list arguments', t => {
    t.plan(1)
    const decoded = encoder.decode(CONTRACT, 'test_list', 'cb_HwFUVFRUVFRUVFRUVFRUVFRUVBiJdZ4=')
    const ints = new Array(17).fill(42n)

    t.deepEqual(
        decoded,
        ints,
        'test_list([42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42])'
    )
})

test('Decode nested list arguments', t => {
    t.plan(1)
    const decoded = encoder.decode(CONTRACT, 'test_nested_list', 'cb_MyMCBCMGCCMKDPLAUC0=')
    const ints = [
        [1n, 2n],
        [3n, 4n],
        [5n, 6n]
    ]

    t.deepEqual(decoded, ints, 'test_nested_list([[1, 2], [3, 4], [5, 6]])')
})

test('Decode tuple arguments', t => {
    t.plan(1)
    t.deepEqual(
        encoder.decode(CONTRACT, 'test_tuple', 'cb_K/9/fDzeoA=='),
        [true, false],
        'test_tuple((true, false))'
    )
})

test('Decode nested tuple arguments', t => {
    t.plan(1)
    t.deepEqual(
        encoder.decode(CONTRACT, 'test_nested_tuple', 'cb_Kyv/fyt//701yEI='),
        [
            [true, false],
            [false, true]
        ],
        'test_nested_tuple(((true, false), (false, true)))'
    )
})

test('Decode map arguments', t => {
    t.plan(1)
    t.deepEqual(
        encoder.decode(CONTRACT, 'test_simple_map', 'cb_LwEOfzGit9U='),
        new Map([[7n, false]]),
        'test_simple_map({[7] = false})'
    )
})

test('Decode nested map arguments', t => {
    t.plan(1)
    t.deepEqual(
        encoder.decode(CONTRACT, 'test_nested_map', 'cb_LwMALwEAfwIvAQL/BC8BEP8Q+3ou'),
        new Map([
            [0n, new Map([[0n, false]])],
            [1n, new Map([[1n, true]])],
            [2n, new Map([[8n, true]])],
        ]),
        'test_nested_map({[0] = {[0] = false}, [1] = {[1] = true}, [2] = {[8] = true}})'
    )
})

test('Decode map with optional key', t => {
    t.plan(1)
    t.deepEqual(
        encoder.decode(CONTRACT, 'test_fancy_map', 'cb_LwGvggABAD8CMr9vhg=='),
        new Map([[undefined, 1n]]),
        'test_fancy_map({[None] = 1}, {[Some(0)] = 2})'
    )
})

test('Decode simple variant arguments', t => {
    t.plan(1)
    t.deepEqual(
        encoder.decode(
            CONTRACT,
            'test_variants',
            'cb_r4QAAAEAAT8xtJ9f'
        ),
        {No: []},
        'test_variants(No)'
    )
})

test('Decode variant arguments with non-zero arity', t => {
    t.plan(1)
    t.deepEqual(
        encoder.decode(
            CONTRACT,
            'test_variants',
            'cb_r4QAAAEAAhsOfGqVXg=='
        ),
        {Yep: [7n]},
        'test_variants(Yep(7))'
    )
})

test('Decode variant arguments with nested variants', t => {
    t.plan(2)
    t.deepEqual(
        encoder.decode(
            CONTRACT,
            'test_nested_variants',
            'cb_r4IBAQAbr4IBAQAbDi9/8t0='
        ),
        {One: [{RelativeTTL: [7n]}]},
        'test_nested_variants(One(RelativeTTL(7)))'
    )

    t.deepEqual(
        encoder.decode(
            CONTRACT,
            'test_nested_variants',
            'cb_r4IBAQEbrwMAO58AoN5ov+GyA+UfUjUboIf3m3go5qFA8MMUpnDHADs/9XB1r4IBAQAbDi8BHXBvaW50ZXKvhAEBAQECG58AoB/A0JnsWhPLkyijF/zs2FKx90ieXgC6CVc8PC22mFVTOxp1fA=='
        ),
        {
            Two: [{
                'AENS.Name': [
                    'ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt',
                    {RelativeTTL: [7n]},
                    new Map([
                        ['pointer', {'AENS.ContractPt': ['ak_Ez6MyeTMm17YnTnDdHTSrzMEBKmy7Uz2sXu347bTDPgVH2ifJ']}]
                    ])
                ]
            }]
        },
        'test_nested_variants(Two(AENS.Name(ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt, RelativeTTL(7), {["pointer"] = AENS.ContractPt(ak_Ez6MyeTMm17YnTnDdHTSrzMEBKmy7Uz2sXu347bTDPgVH2ifJ)})))'
    )
})

test('Decode variant with template arguments', t => {
    t.plan(1)
    t.deepEqual(
        encoder.decode(
            CONTRACT,
            'test_template_variants',
            'cb_r4IABAFLDv8SKhktM40=',
        ),
        {Any: [7n, true, 9n, 21n]},
        'test_template_variants(Any(7, true, 9, 21))'
    )
})

test('Decode type aliases', t => {
    t.plan(2)
    t.is(
        encoder.decode(CONTRACT, 'test_int_type', 'cb_DtbN98k='),
        7n,
        'test_int_type(7)'
    )

    t.deepEqual(
        encoder.decode(CONTRACT, 'test_map_type', 'cb_LwENZm9vJjJRlLM='),
        new Map([["foo", 19n]]),
        'test_map_type({["foo"] = 19})'
    )
})

test('Decode template type', t => {
    t.plan(1)
    t.is(
        encoder.decode(
            CONTRACT,
            'test_template_type',
            'cb_DtbN98k='
        ),
        7n,
        'test_template_type(7)'
    )
})

test('Decode optional arguments', t => {
    t.plan(2)
    t.deepEqual(
        encoder.decode(CONTRACT, 'test_optional', 'cb_r4IAAQA/aHG2bw=='),
        undefined,
        'test_optional(None)'
    )

    t.deepEqual(
        encoder.decode(CONTRACT, 'test_optional', 'cb_r4IAAQEbb4IBVPA+5jI='),
        404n,
        'test_optional(Some(404))'
    )
})

test('Decode records', t => {
    t.plan(2)
    t.deepEqual(
        encoder.decode(
            CONTRACT,
            'test_record',
            'cb_KwAAUjeM0Q=='
        ),
        {x: 0n, y: 0n},
        'test_record({x = 0, y = 0})'
    )

    t.deepEqual(
        encoder.decode(
            CONTRACT,
            'test_nested_record',
            'cb_OysCBAYISeTR0A=='
        ),
        {origin: {x: 1n, y: 2n}, a: 3n, b: 4n},
        'test_nested_record({origin = {x = 1, y = 2}, a = 3, b = 4})'
    )
})

test('Decode option record', t => {
    t.plan(1)
    t.deepEqual(
        encoder.decode(CONTRACT, 'test_option_record', 'cb_K1SvggABAD98wIfX'),
        {x: 42n, y: undefined},
        'test_option_record({x = 42, y = None})'
    )
})

test('Decode list of records', t => {
    t.plan(1)
    t.deepEqual(
        encoder.decode(
            CONTRACT,
            'test_records_list',
            'cb_MysAACsCAisEBMjzXEk='
        ),
        [
            {x: 0n, y: 0n},
            {x: 1n, y: 1n},
            {x: 2n, y: 2n},
        ],
        'test_records_list([{x = 0, y = 0}, {x = 1, y = 1}, {x = 2, y = 2}])'
    )
})

test('Decode records map', t => {
    t.plan(1)
    t.deepEqual(
        encoder.decode(
            CONTRACT,
            'test_records_map',
            'cb_LwMrAAArAgIrAgQrBggrbyQYKy5vIzf5arA='
        ),
        new Map([
            [{x: 0n, y: 0n}, {x: 1n, y: 1n}],
            [{x: 1n, y: 2n}, {x: 3n, y: 4n}],
            [{x: 100n, y: 12n}, {x: 23n, y: 99n}],
        ]),
        `test_records_map(
                {[{x = 0, y = 0}] = {x = 1, y = 1},
                [{x = 1, y = 2}] = {x = 3, y = 4},
                [{x = 100, y = 12}] = {x = 23, y = 99}}
        )`
    )
})

test('Decode primitive tuple', t => {
    t.plan(1)
    t.deepEqual(
        encoder.decode(
            CONTRACT,
            'test_primitives_tuple',
            'cb_ewL/EXRlc3RPAJ8BCb7vnwGBAAECAwQFBgcICQoLDA0ODwABAgMEBQYHCAkKCwwNDg+fAQEAAAECAwQFBgcICQoLDA0ODwABAgMEBQYHCAkKCwwNDg8AAQIDBAUGBwgJCgsMDQ4PAAECAwQFBgcICQoLDA0ODzwY0fk='
        ),
        [
            1n,
            true,
            "test",
            0n,
            HexStringToByteArray("0xBEEF"),
            HexStringToByteArray("0x000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f"),
            HexStringToByteArray("0x000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f")
        ],
        'test_primitives_tuple((1, true, "test", Bits.none, 0xBEEF, #000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f, #000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f))'
    )
})

test('Decode addresses tuple', t => {
    t.plan(1)
    t.deepEqual(
        encoder.decode(
            CONTRACT,
            'test_addresses_tuple',
            'cb_S58AoN5ov+GyA+UfUjUboIf3m3go5qFA8MMUpnDHADs/9XB1nwKgH8DQmexaE8uTKKMX/OzYUrH3SJ5eALoJVzw8LbaYVVOfA6DK8iokTtrAPSbwKhfZI5QtBVz8hiMoslpRwoS8nUIOSZ8EoO0e59wCeNBc6VCUc8UKk9Q6KLKNUDL2332qRC/hNxNI/pLnKw=='
        ),
        [
            'ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt',
            'ct_Ez6MyeTMm17YnTnDdHTSrzMEBKmy7Uz2sXu347bTDPgVH2ifJ',
            'ok_2YNyxd6TRJPNrTcEDCe9ra59SVUdp9FR9qWC5msKZWYD9bP9z5',
            'oq_2oRvyowJuJnEkxy58Ckkw77XfWJrmRgmGaLzhdqb67SKEL1gPY',
        ],
        'test_addresses_tuple((ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt, ct_Ez6MyeTMm17YnTnDdHTSrzMEBKmy7Uz2sXu347bTDPgVH2ifJ, ok_2YNyxd6TRJPNrTcEDCe9ra59SVUdp9FR9qWC5msKZWYD9bP9z5, oq_2oRvyowJuJnEkxy58Ckkw77XfWJrmRgmGaLzhdqb67SKEL1gPY))'
    )
})

test('Decode complex tuple', t => {
    t.plan(1)
    t.deepEqual(
        encoder.decode(
            CONTRACT,
            'test_complex_tuple',
            'cb_WysCAq+EAAABAAIbBjMCBAYvAgIEBggrCgyRsE4R'
        ),
        [
            {x: 1n, y: 1n},
            {Yep: [3n]},
            [1n, 2n, 3n],
            new Map([[1n, 2n], [3n, 4n]]),
            [5n, 6n]
        ],
        'test_complex_tuple(({x = 1, y = 1}, Yep(3), [1, 2, 3], {[1] = 2, [3] = 4}, (5, 6)))'
    )
})

test('Decode singleton record (optimized)', t => {
    t.plan(1)
    t.deepEqual(
        encoder.decode(
            CONTRACT,
            'test_singleton_record',
            'cb_ABQG4Fg='
        ),
        0n,
        'test_singleton_record({x = 0})'
    )
})

test('Decode Set.set', t => {
    t.plan(1)
    t.deepEqual(
        encoder.decode(
            CONTRACT,
            'test_set',
            'cb_LwQKPxA/Gj8qPwZjWoo='
        ),
        new Set([5n, 8n, 13n, 21n]),
        'test_set({to_map = {[5] = (), [8] = (), [13] = (), [21] = ()}})'
    )
})

test('Decode BLS12_381.fr', t => {
    t.plan(1)
    t.deepEqual(
        encoder.decode(CONTRACT, 'test_bls12_381_fr', 'cb_nwGBxHFEFDqOu+s9/hWhDQxmnzSFvfQ6dkSwETqb5Rgy7EblqaTu'),
        0XDEADBEEFn,
        'test_bls12_381_fr(3735928559)'
    )
})

test('Decode BLS12_381.fp', t => {
    t.plan(1)
    t.deepEqual(
        encoder.decode(CONTRACT, 'test_bls12_381_fp', 'cb_nwHBA/Xt2rba+aow52i/Vr/nGSDbg1ErD/oOVs0LOV1F83sEMEfueZoY+Ng3idzNLTcU1fPMEQ=='),
        0XDEADBEEFn,
        'test_bls12_381_fp(3735928559)'
    )
})

test('Decode BLS12_381.g1', t => {
    t.plan(1)
    t.deepEqual(
        encoder.decode(CONTRACT, 'test_bls12_381_g1', 'cb_O58Bwf3/AgAAAAl2AgAMxAsA9Ou6WMdTV5hIX0VXUnBTWM53bexWopcaB1yT5ID6w172FZ8BwU9VBgAAABMyBQDE1hgAPLlRu92wDV5gV8ubH+0hZSWLAyxiAXmN8myM4oG7navrEZ8BwaGqCQAAAB3uBwB86SUAhIboHfQNxCN4T1Hg7GnwcXyemWttYFoA3n2F4IJ8d/jgDT13HE8='),
        {
            x: 1n,
            y: 2n,
            z: 3n
        },
        'test_bls12_381_g1(1, 2, 3)'
    )
})

test('Decode FATE errors', t => {
    t.plan(3)
    // error message is just string, no FATE encoding
    const error = encoder.decodeString(
        'cb_VHlwZSBlcnJvciBvbiBjYWxsOiBbe2J5dGVzLDw8MjQwLDIsLi4uPj59XSBpcyBub3Qgb2YgdHlwZSBbe2J5dGVzLDMyfV3EtJjU'
    )
    t.is(error.toString(), 'Type error on call: [{bytes,<<240,2,...>>}] is not of type [{bytes,32}]')

    t.throws(
        () => encoder.decodeString('err_abc'),
        { name: 'FormatError' }
    )

    // revert messages are FATE string encoded
    const revert = encoder.decodeFateString('cb_OXJlcXVpcmUgZmFpbGVkarP9mg==')
    t.is(revert, 'require failed')
})

test('Decode events', t => {
    t.plan(4)
    t.deepEqual(
        encoder.decodeEvent(
            CONTRACT,
            'cb_dHJpZ2dlcmVk1FYuYA==',
            [
                34853523142692495808479485503424878684430196596020091237715106250497712463899n,
                17
            ]
        ),
        {EventTwo: [17n, 'triggered']}
    )

    t.deepEqual(
        encoder.decodeEvent(
            CONTRACT,
            'cb_dHJpZ2dlciAzIGRhdGGEhtnk',
            [
                31681207293023881403488055235089918158550553865217088186518345674953571854592n,
                1337n,
                0,
                1
            ]
        ),
        {EventThree: [1337n, false, 'trigger 3 data', 0b00000001n]}
    )

    t.deepEqual(
        encoder.decodeEvent(
            CONTRACT,
            'cb_AAECAwQFBgcICQoLDA0ODwABAgMEBQYHCAkKCwwNDg8AAQIDBAUGBwgJCgsMDQ4PAAECAwQFBgcICQoLDA0ODwAx+Sc=',
            [
                37536694928074887618788845902443693572461880487987867102331072713458132149167n,
                78876037347534273874947325679n,
                1780731860627700044960722568376592179391279163832551066649583786025356815n,
                100598528798509517526571160460879105275813542426365099212297795570240408875125n,
            ]
        ),
        {
            EventFour: [
                HexStringToByteArray("0xfedcba9876543210deadbeef"),
                HexStringToByteArray("0x000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f"),
                HexStringToByteArray("0x000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f"),
                'ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt'
            ]
        }
    )

    t.deepEqual(
        encoder.decodeEvent(
            CONTRACT,
            'cb_dHJpZ2dlciA1IGRhdGHUCNNt',
            [
                3185384254601604808758985712725166327926049022179140726175527582565167826658n,
                14362372655521436838170755271847218341882561275649283336261918563942507500883n,
                91795063255705172344756673568691065400082428174303230431501479273130556001865n,
                107252750761032185514125154622280566678392879123784198680081054042150971839304n,
            ]
        ),
        {
            EventFive: [
                "trigger 5 data",
                'ct_Ez6MyeTMm17YnTnDdHTSrzMEBKmy7Uz2sXu347bTDPgVH2ifJ',
                'ok_2YNyxd6TRJPNrTcEDCe9ra59SVUdp9FR9qWC5msKZWYD9bP9z5',
                'oq_2oRvyowJuJnEkxy58Ckkw77XfWJrmRgmGaLzhdqb67SKEL1gPY'
            ]
        }
    )
})

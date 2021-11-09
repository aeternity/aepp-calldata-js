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

test('Decode variant arguments with nested variant', t => {
    t.plan(1)
    t.deepEqual(
        encoder.decode(
            CONTRACT,
            'test_nested_variants',
            'cb_r4IBAQAbr4IBAQAbDi9/8t0='
        ),
        {One: [{RelativeTTL: [7n]}]},
        'test_nested_variants(One(RelativeTTL(7)))'
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

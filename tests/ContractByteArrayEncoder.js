const test = require('./test')
const ContractByteArrayEncoder = require('../src/ContractByteArrayEncoder')
const {
    FateTypeBool,
    FateTypeInt,
    FateTypeString,
    FateTypeBytes,
    FateTypeBits,
    FateTypeAccountAddress,
    FateTypeContractAddress,
    FateTypeOracleAddress,
    FateTypeOracleQueryAddress,
    FateTypeChannelAddress,
    FateTypeList,
    FateTypeMap,
    FateTypeTuple,
    FateTypeVariant,
} = require('../src/FateTypes')

const encoder = new ContractByteArrayEncoder()

test.todo('StoreMap')
test.todo('Type)')

test('Encode primitives', t => {
    t.plan(7)

    t.is(encoder.encode(FateTypeBool(), true), 'cb_/8CwV/U=', 'boolean')
    t.is(encoder.encode(FateTypeInt(), 191919n), 'cb_b4MC7W/bKkpn', 'int')
    t.is(encoder.encode(FateTypeString(), 'whoolymoly'), 'cb_KXdob29seW1vbHlGazSE', 'string')
    t.is(encoder.encode(FateTypeBytes(32), new Uint8Array([0xbe, 0xef])), 'cb_nwEJvu+rlRrs', 'bytes')
    t.is(encoder.encode(FateTypeBits(), 0b0n), 'cb_TwBixWzt', 'Bits.none')
    t.is(encoder.encode(FateTypeBits(), -1n), 'cb_zwH34yVW', 'Bits.all')
    t.is(encoder.encode(FateTypeBits(), 0b00000001n), 'cb_TwEPbJQb', 'Bits.set(Bits.none, 0)')
})

test('Encode addresses', t => {
    t.plan(5)

    t.is(
        encoder.encode(FateTypeAccountAddress(), 'ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt'),
        'cb_nwCg3mi/4bID5R9SNRugh/ebeCjmoUDwwxSmcMcAOz/1cHVYbXWK'
    )

    t.is(
        encoder.encode(FateTypeContractAddress(), 'ct_Ez6MyeTMm17YnTnDdHTSrzMEBKmy7Uz2sXu347bTDPgVH2ifJ'),
        'cb_nwKgH8DQmexaE8uTKKMX/OzYUrH3SJ5eALoJVzw8LbaYVVPlirXw'
    )

    t.is(
        encoder.encode(FateTypeOracleAddress(), 'ok_2YNyxd6TRJPNrTcEDCe9ra59SVUdp9FR9qWC5msKZWYD9bP9z5'),
        'cb_nwOgyvIqJE7awD0m8CoX2SOULQVc/IYjKLJaUcKEvJ1CDkkkbvWd'
    )

    t.is(
        encoder.encode(FateTypeOracleQueryAddress(), 'oq_2oRvyowJuJnEkxy58Ckkw77XfWJrmRgmGaLzhdqb67SKEL1gPY'),
        'cb_nwSg7R7n3AJ40FzpUJRzxQqT1Dooso1QMvbffapEL+E3E0g6bqyq'
    )

    t.is(
        encoder.encode(FateTypeChannelAddress(), 'ch_16qJFWMMHFy3xDdLmvUeyc2S6FrWRhJP51HsvDYdz9d1FsYG'),
        'cb_nwWgAAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8FfXgz'
    )
})

test('Encode composite types', t => {
    t.plan(4)
    t.deepEqual(
        encoder.encode(FateTypeList(FateTypeInt()), [1, 2, 3, 5, 8, 13, 21].map(i => BigInt(i))),
        'cb_cwIEBgoQGiqNmBRX'
    )

    t.deepEqual(
        encoder.encode(FateTypeTuple([FateTypeBool(), FateTypeBool()]), [true, false]),
        'cb_K/9/fDzeoA=='
    )

    t.deepEqual(
        encoder.encode(FateTypeMap(FateTypeInt(), FateTypeBool()), new Map([[7n, false]])),
        'cb_LwEOfzGit9U='
    )

    const variants = [{Nope: []}, {No: []}, {Yep: [FateTypeInt()]}, {Yes: []}]
    t.deepEqual(
        encoder.encode(FateTypeVariant(variants), {No: []}),
        'cb_r4QAAAEAAT8xtJ9f'
    )
})

test('Decode primitives', t => {
    t.plan(7)

    t.is(encoder.decode('cb_/8CwV/U='), true, 'boolean')
    t.is(encoder.decode('cb_b4MC7W/bKkpn'), 191919n, 'int')
    t.is(encoder.decode('cb_KXdob29seW1vbHlGazSE'), 'whoolymoly', 'string')
    t.deepEqual(encoder.decode('cb_nwEJvu+rlRrs'), new Uint8Array([0xbe, 0xef]), 'bytes')
    t.is(encoder.decode('cb_TwBixWzt'), 0b0n, 'Bits.none')
    t.is(encoder.decode('cb_zwH34yVW'), -1n, 'Bits.all')
    t.is(encoder.decode('cb_TwEPbJQb'), 0b00000001n, 'Bits.set(Bits.none, 0)')
})

test('Decode addresses', t => {
    t.plan(5)

    t.is(
        encoder.decode('cb_nwCg3mi/4bID5R9SNRugh/ebeCjmoUDwwxSmcMcAOz/1cHVYbXWK'),
        'ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt',
        'Account Address'
    )

    t.is(
        encoder.decode('cb_nwKgH8DQmexaE8uTKKMX/OzYUrH3SJ5eALoJVzw8LbaYVVPlirXw'),
        'ct_Ez6MyeTMm17YnTnDdHTSrzMEBKmy7Uz2sXu347bTDPgVH2ifJ',
        'Contract Address'
    )

    t.is(
        encoder.decode('cb_nwOgyvIqJE7awD0m8CoX2SOULQVc/IYjKLJaUcKEvJ1CDkkkbvWd'),
        'ok_2YNyxd6TRJPNrTcEDCe9ra59SVUdp9FR9qWC5msKZWYD9bP9z5',
        'Oracle Address (pubkey)'
    )

    t.is(
        encoder.decode('cb_nwSg7R7n3AJ40FzpUJRzxQqT1Dooso1QMvbffapEL+E3E0g6bqyq'),
        'oq_2oRvyowJuJnEkxy58Ckkw77XfWJrmRgmGaLzhdqb67SKEL1gPY',
        'Oracle Query ID'
    )

    t.is(
        encoder.decode('cb_nwWgAAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8FfXgz'),
        'ch_16qJFWMMHFy3xDdLmvUeyc2S6FrWRhJP51HsvDYdz9d1FsYG',
        'Channel Address'
    )
})

test('Decode composite types', t => {
    t.plan(4)
    const ints = [1, 2, 3, 5, 8, 13, 21].map(i => BigInt(i))
    t.deepEqual(encoder.decode('cb_cwIEBgoQGiqNmBRX'), ints, 'list')
    t.deepEqual(encoder.decode('cb_K/9/fDzeoA=='), [true, false], 'tuple')
    t.deepEqual(encoder.decode('cb_LwEOfzGit9U='), new Map([[7n, false]]), 'map')
    t.deepEqual(encoder.decode('cb_r4QAAAEAAT8xtJ9f'), {1: []}, 'variant (Nope | No | Yep(int) | Yes)')
})

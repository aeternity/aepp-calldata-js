const test = require('./test')
const ApiEncoder = require('../src/ApiEncoder')

const encoder = new ApiEncoder()
const payload = new Uint8Array(Array.from({length: 32}, (x, i) => i))

test('Encode', t => {
    t.plan(6)
    t.deepEqual(
        encoder.encode('contract_bytearray', new Uint8Array()),
        'cb_Xfbg4g=='
    )

    t.deepEqual(
        encoder.encode('contract_pubkey', payload),
        'ct_16qJFWMMHFy3xDdLmvUeyc2S6FrWRhJP51HsvDYdz9d1FsYG'
    )

    t.deepEqual(
        encoder.encode('account_address', payload),
        'ak_16qJFWMMHFy3xDdLmvUeyc2S6FrWRhJP51HsvDYdz9d1FsYG'
    )

    t.deepEqual(
        encoder.encode('channel', payload),
        'ch_16qJFWMMHFy3xDdLmvUeyc2S6FrWRhJP51HsvDYdz9d1FsYG'
    )

    t.deepEqual(
        encoder.encode('oracle_pubkey', payload),
        'ok_16qJFWMMHFy3xDdLmvUeyc2S6FrWRhJP51HsvDYdz9d1FsYG'
    )

    t.deepEqual(
        encoder.encode('oracle_query_id', payload),
        'oq_16qJFWMMHFy3xDdLmvUeyc2S6FrWRhJP51HsvDYdz9d1FsYG'
    )
})

test('Encode errors', t => {
    t.plan(2)

    t.throws(
        () => encoder.encode('invalid_type'),
        { name: 'FateTypeError' }
    )

    t.throws(
        () => encoder.encode('contract_pubkey', new Uint8Array([1,2,3])),
        { name: 'FateTypeError' }
    )
})

test('Decode', t => {
    t.plan(6)
    t.deepEqual(
        Array.from(encoder.decode('cb_Xfbg4g==')),
        []
    )

    t.deepEqual(
        new Uint8Array(encoder.decode('ct_16qJFWMMHFy3xDdLmvUeyc2S6FrWRhJP51HsvDYdz9d1FsYG')),
        payload
    )

    t.deepEqual(
        new Uint8Array(encoder.decode('ak_16qJFWMMHFy3xDdLmvUeyc2S6FrWRhJP51HsvDYdz9d1FsYG')),
        payload
    )

    t.deepEqual(
        new Uint8Array(encoder.decode('ch_16qJFWMMHFy3xDdLmvUeyc2S6FrWRhJP51HsvDYdz9d1FsYG')),
        payload
    )

    t.deepEqual(
        new Uint8Array(encoder.decode('ok_16qJFWMMHFy3xDdLmvUeyc2S6FrWRhJP51HsvDYdz9d1FsYG')),
        payload
    )

    t.deepEqual(
        new Uint8Array(encoder.decode('oq_16qJFWMMHFy3xDdLmvUeyc2S6FrWRhJP51HsvDYdz9d1FsYG')),
        payload
    )
})

test('Decode errors', t => {
    t.plan(4)

    t.throws(
        () => encoder.decode('in_123'),
        { name: 'FormatError' }
    )

    t.throws(
        () => encoder.decode('cb123'),
        { name: 'FormatError' }
    )

    t.throws(
        () => encoder.decode('ak_123'),
        { name: 'FormatError', 'message': 'Invalid checksum'}
    )

    t.throws(
        () => encoder.decode('ak_3DUz7ncyT'),
        { name: 'FormatError'}
    )
})

test('Decode with type errors', t => {
    t.plan(3)

    t.throws(
        () => encoder.decodeWithType('in_123', 'contract_pubkey'),
        { name: 'FateTypeError' }
    )

    t.throws(
        () => encoder.decodeWithType('cb_123', 'some_ttype'),
        { name: 'FateTypeError' }
    )

    t.throws(
        () => encoder.decodeWithType('cb_Xfbg4g==', 'account_address'),
        { name: 'FateTypeError'}
    )
})

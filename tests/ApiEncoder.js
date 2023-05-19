const test = require('./test')
const ApiEncoder = require('../src/ApiEncoder')

const encoder = new ApiEncoder()
const mkPayload = (size) => new Uint8Array(Array.from({ length: size }, (x, i) => i))
const payload = mkPayload(32)
const payload64 = mkPayload(64)

test('Encode', t => {
    t.plan(17)

    t.deepEqual(
        encoder.encode('contract_bytearray', new Uint8Array()),
        'cb_Xfbg4g=='
    )

    t.deepEqual(
        encoder.encode('block_pof_hash', payload),
        'bf_16qJFWMMHFy3xDdLmvUeyc2S6FrWRhJP51HsvDYdz9d1FsYG'
    )

    t.deepEqual(
        encoder.encode('block_tx_hash', payload),
        'bx_16qJFWMMHFy3xDdLmvUeyc2S6FrWRhJP51HsvDYdz9d1FsYG'
    )

    t.deepEqual(
        encoder.encode('block_state_hash', payload),
        'bs_16qJFWMMHFy3xDdLmvUeyc2S6FrWRhJP51HsvDYdz9d1FsYG'
    )

    t.deepEqual(
        encoder.encode('contract_pubkey', payload),
        'ct_16qJFWMMHFy3xDdLmvUeyc2S6FrWRhJP51HsvDYdz9d1FsYG'
    )

    t.deepEqual(
        encoder.encode('account_pubkey', payload),
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

    t.deepEqual(
        encoder.encode('key_block_hash', payload),
        'kh_16qJFWMMHFy3xDdLmvUeyc2S6FrWRhJP51HsvDYdz9d1FsYG'
    )

    t.deepEqual(
        encoder.encode('micro_block_hash', payload),
        'mh_16qJFWMMHFy3xDdLmvUeyc2S6FrWRhJP51HsvDYdz9d1FsYG'
    )

    t.deepEqual(
        encoder.encode('peer_pubkey', payload),
        'pp_16qJFWMMHFy3xDdLmvUeyc2S6FrWRhJP51HsvDYdz9d1FsYG'
    )

    t.deepEqual(
        encoder.encode('name', payload),
        'nm_16qJFWMMHFy3xDdLmvUeyc2S6FrWRhJP51HsvDYdz9d1FsYG'
    )

    t.deepEqual(
        encoder.encode('transaction_hash', payload),
        'th_16qJFWMMHFy3xDdLmvUeyc2S6FrWRhJP51HsvDYdz9d1FsYG'
    )

    t.deepEqual(
        encoder.encode('signature', payload64),
        'sg_12jVjGbD3wrDT6L19fyB486MyMfMdNjc148QTEgR2qypJqKtTHnBDUjubAxFytva52tzNzog1PChUSJ1vFMgt11fwd15'
    )

    t.deepEqual(
        encoder.encode('commitment', payload),
        'cm_16qJFWMMHFy3xDdLmvUeyc2S6FrWRhJP51HsvDYdz9d1FsYG'
    )

    t.deepEqual(
        encoder.encode('bytearray', new Uint8Array()),
        'ba_Xfbg4g=='
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
    t.plan(17)
    t.deepEqual(
        encoder.decode('cb_Xfbg4g=='),
        new Uint8Array()
    )

    t.deepEqual(
        encoder.decode('bf_16qJFWMMHFy3xDdLmvUeyc2S6FrWRhJP51HsvDYdz9d1FsYG'),
        payload
    )

    t.deepEqual(
        encoder.decode('bx_16qJFWMMHFy3xDdLmvUeyc2S6FrWRhJP51HsvDYdz9d1FsYG'),
        payload
    )

    t.deepEqual(
        encoder.decode('bs_16qJFWMMHFy3xDdLmvUeyc2S6FrWRhJP51HsvDYdz9d1FsYG'),
        payload
    )

    t.deepEqual(
        encoder.decode('ct_16qJFWMMHFy3xDdLmvUeyc2S6FrWRhJP51HsvDYdz9d1FsYG'),
        payload
    )

    t.deepEqual(
        encoder.decode('ak_16qJFWMMHFy3xDdLmvUeyc2S6FrWRhJP51HsvDYdz9d1FsYG'),
        payload
    )

    t.deepEqual(
        encoder.decode('ch_16qJFWMMHFy3xDdLmvUeyc2S6FrWRhJP51HsvDYdz9d1FsYG'),
        payload
    )

    t.deepEqual(
        encoder.decode('ok_16qJFWMMHFy3xDdLmvUeyc2S6FrWRhJP51HsvDYdz9d1FsYG'),
        payload
    )

    t.deepEqual(
        encoder.decode('oq_16qJFWMMHFy3xDdLmvUeyc2S6FrWRhJP51HsvDYdz9d1FsYG'),
        payload
    )

    t.deepEqual(
        encoder.decode('kh_16qJFWMMHFy3xDdLmvUeyc2S6FrWRhJP51HsvDYdz9d1FsYG'),
        payload
    )

    t.deepEqual(
        encoder.decode('mh_16qJFWMMHFy3xDdLmvUeyc2S6FrWRhJP51HsvDYdz9d1FsYG'),
        payload
    )

    t.deepEqual(
        encoder.decode('pp_16qJFWMMHFy3xDdLmvUeyc2S6FrWRhJP51HsvDYdz9d1FsYG'),
        payload
    )

    t.deepEqual(
        encoder.decode('nm_16qJFWMMHFy3xDdLmvUeyc2S6FrWRhJP51HsvDYdz9d1FsYG'),
        payload
    )

    t.deepEqual(
        encoder.decode('th_16qJFWMMHFy3xDdLmvUeyc2S6FrWRhJP51HsvDYdz9d1FsYG'),
        payload
    )

    t.deepEqual(
        encoder.decode('sg_12jVjGbD3wrDT6L19fyB486MyMfMdNjc148QTEgR2qypJqKtTHnBDUjubAxFytva52tzNzog1PChUSJ1vFMgt11fwd15'),
        payload64
    )

    t.deepEqual(
        encoder.decode('cm_16qJFWMMHFy3xDdLmvUeyc2S6FrWRhJP51HsvDYdz9d1FsYG'),
        payload
    )

    t.deepEqual(
        encoder.decode('ba_Xfbg4g=='),
        new Uint8Array()
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
        { name: 'FormatError', message: 'Invalid checksum'}
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
        () => encoder.decodeWithType('cb_Xfbg4g==', 'account_pubkey'),
        { name: 'FateTypeError'}
    )
})

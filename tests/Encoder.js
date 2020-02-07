const fs = require('fs')
const test = require('ava');
const Encoder = require('../Encoder.js')

test.before(async t => {
    const aci = JSON.parse(fs.readFileSync('build/identity.json', 'utf-8'))
    const encoder = new Encoder(aci[0].contract)

    t.context.encoder = encoder
});

test('Encode implicit init', t => {
    const encoded = t.context.encoder.encode('init', [])
    t.is(encoded, 'cb_KxFE1kQfP4oEp9E=', 'init()')
});

test('Encode empty arguments', t => {
    const encoded = t.context.encoder.encode('test_empty', [])
    t.is(encoded, 'cb_KxFLLL5rP7TGyoM=', 'test_empty()')
});

test('Encode boolean arguments', t => {
    const encoded = t.context.encoder.encode('test_bool', [true, false])
    t.is(encoded, 'cb_KxGhC8WIK/9/56SENg==', 'test_bool(true, false)')
});

test('Encode single int arguments', t => {
    const encoded1 = t.context.encoder.encode('test_single_int', [63])
    t.is(encoded1, 'cb_KxGcvF48G34gDHTz', 'test_single_int(63)')

    const encoded2 = t.context.encoder.encode('test_single_int', [-63])
    t.is(encoded2, 'cb_KxGcvF48G/4zzZ4m', 'test_single_int(-63)')
});

test('Encode multiple int arguments', t => {
    const encoded = t.context.encoder.encode('test_int', [63, -63, 64, -64])
    t.is(encoded, 'cb_KxFAuEQES37+bwDvAODy1qs=', 'test_int(63, -63, 64, -64)')
});

test('Encode tuple arguments', t => {
    const encoded = t.context.encoder.encode('test_tuple', [[true, false]])
    t.is(encoded, 'cb_KxFbdB1sGyv/fzQzK9M=', 'test_tuple((true, false))')
});

test('Encode nested tuple arguments', t => {
    const encoded = t.context.encoder.encode('test_nested_tuple', [[[true, false], [false, true]]])
    t.is(encoded, 'cb_KxHkKCkeGysr/38rf/+ZQRDt', 'test_nested_tuple(((true, false), (false true)))')
});

test('Encode simple variant arguments', t => {
    const encoded = t.context.encoder.encode('test_variants', [{variant: 'No', values: []}])
    t.is(encoded, 'cb_KxFiWgvXG6+EAAABAAE/Yp8XdQ==', 'test_variants(No)')
});

test('Encode variant arguments with non-zero arity', t => {
    const encoded = t.context.encoder.encode('test_variants', [{variant: 'Yep', values: [7]}])
    t.is(encoded, 'cb_KxFiWgvXG6+EAAABAAIbDv+CzlA=', 'test_variants(Yep(7))')
});

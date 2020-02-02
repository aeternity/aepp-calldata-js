const fs = require('fs')
const test = require('ava');
const Coder = require('../Coder.js')

test.before(async t => {
    const aci = JSON.parse(fs.readFileSync('build/identity.json', 'utf-8'))
    const coder = Object.create(Coder)

    t.context.aci = aci[0].contract
    t.context.coder = coder
});

test('Encode implicit init', t => {
    const encoded = t.context.coder.encode(t.context.aci, 'init', [])
    t.is(encoded, 'cb_KxFE1kQfP4oEp9E=', 'init()')
});

test('Encode empty arguments', t => {
    const encoded = t.context.coder.encode(t.context.aci, 'test_empty', [])
    t.is(encoded, 'cb_KxFLLL5rP7TGyoM=', 'test_empty()')
});

test('Encode boolean arguments', t => {
    const encoded = t.context.coder.encode(t.context.aci, 'test_bool', [true, false])
    t.is(encoded, 'cb_KxGhC8WIK/9/56SENg==', 'test_bool(true, false)')
});

test('Encode single int arguments', t => {
    const encoded1 = t.context.coder.encode(t.context.aci, 'test_single_int', [63])
    t.is(encoded1, 'cb_KxGcvF48G34gDHTz', 'test_single_int(63)')

    const encoded2 = t.context.coder.encode(t.context.aci, 'test_single_int', [-63])
    t.is(encoded2, 'cb_KxGcvF48G/4zzZ4m', 'test_single_int(-63)')
});

test('Encode multiple int arguments', t => {
    const encoded = t.context.coder.encode(t.context.aci, 'test_int', [63, -63, 64, -64])
    t.is(encoded, 'cb_KxFAuEQES37+bwDvAODy1qs=', 'test_int(63, -63, 64, -64)')
});

test('Encode tuple arguments', t => {
    const encoded = t.context.coder.encode(t.context.aci, 'test_tuple', [[true, false]])
    t.is(encoded, 'cb_KxFbdB1sGyv/fzQzK9M=', 'test_tuple((true, false))')
});

test('Encode nested tuple arguments', t => {
    const encoded = t.context.coder.encode(t.context.aci, 'test_nested_tuple', [[[true, false], [false, true]]])
    t.is(encoded, 'cb_KxHkKCkeGysr/38rf/+ZQRDt', 'test_nested_tuple(((true, false), (false true)))')
});

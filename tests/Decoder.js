const fs = require('fs')
const test = require('ava');
const Encoder = require('../src/Encoder.js')

const CONTRACT = 'Test'

test.before(async t => {
    const aci = JSON.parse(fs.readFileSync('build/contracts/Test.json', 'utf-8'))
    const encoder = new Encoder(aci)

    t.context.encoder = encoder
});

test('Encode boolean return', t => {
    t.is(
        t.context.encoder.decode(CONTRACT, 'test_bool', 'cb_/8CwV/U='),
        true
    )
});

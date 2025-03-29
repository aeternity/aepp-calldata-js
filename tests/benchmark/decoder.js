import Benchmark from 'benchmark'
import Encoder from '../../src/Encoder.js'
import aci from '../../build/contracts/Test.json' with {type: 'json'}

const CONTRACT = 'Test'
const encoder = new Encoder(aci)

const suite = new Benchmark.Suite()

// add tests
suite.add('Encoder#decode(int)', () => {
    encoder.decode(CONTRACT, 'test_single_int', 'cb_b4MC7W/bKkpn')
})

suite.add('Encoder#decode(bool)', () => {
    encoder.decode(CONTRACT, 'test_bool', 'cb_/8CwV/U=')
})

suite.add('Encoder#decode(bytes)', () => {
    encoder.decode(CONTRACT, 'test_bytes', 'cb_nwEJvu+rlRrs')
})

suite.add('Encoder#decode(string)', () => {
    encoder.decode(CONTRACT, 'test_string', 'cb_KXdob29seW1vbHlGazSE')
})

suite.add('Encoder#decode(hash)', () => {
    encoder.decode(CONTRACT, 'test_hash', 'cb_nwGBAAECAwQFBgcICQoLDA0ODwABAgMEBQYHCAkKCwwNDg/55Yfk')
})

suite.add('Encoder#decode(signature)', () => {
    encoder.decode(
        CONTRACT,
        'test_signature',
        'cb_nwEBAAABAgMEBQYHCAkKCwwNDg8AAQIDBAUGBwgJCgsMDQ4PAAECAwQFBgcICQoLDA0ODwABAgMEBQYHCAkKCwwNDg/EV2+8'
    )
})

suite.add('Encoder#decode(address)', () => {
    encoder.decode(
        CONTRACT,
        'test_account_address',
        'cb_nwCg3mi/4bID5R9SNRugh/ebeCjmoUDwwxSmcMcAOz/1cHVYbXWK'
    )
})

suite.add('Encoder#decode(bits)', () => {
    encoder.decode(CONTRACT, 'test_bits', 'cb_TwEPbJQb')
})

suite.add('Encoder#decode(list)', () => {
    encoder.decode(CONTRACT, 'test_list', 'cb_cwIEBgoQGiqNmBRX')
})

suite.add('Encoder#decode(map)', () => {
    encoder.decode(CONTRACT, 'test_simple_map', 'cb_LwEOfzGit9U=')
})

suite.add('Encoder#decode(tuple)', () => {
    encoder.decode(CONTRACT, 'test_tuple', 'cb_K/9/fDzeoA==')
})

suite.add('Encoder#decode(variant)', () => {
    encoder.decode(CONTRACT, 'test_variants', 'cb_r4QAAAEAAT8xtJ9f')
})

suite.add('Encoder#decode(record)', () => {
    encoder.decode(CONTRACT, 'test_record', 'cb_KwAAUjeM0Q==')
})

/* eslint-disable no-console */

// print results
suite.on('cycle', event => {
    console.log(String(event.target))
})

// show some simple stats
suite.on('complete', () => {
    console.log(`Fastest is ${suite.filter('fastest').map('name')}`)
    console.log(`Slowest is ${suite.filter('slowest').map('name')}`)
})

// run async
suite.run({async: true})

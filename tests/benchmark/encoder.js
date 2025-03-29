import Benchmark from 'benchmark'
import Encoder from '../../src/Encoder.js'
import aci from '../../build/contracts/Test.json' with {type: 'json'}

const CONTRACT = 'Test'
const encoder = new Encoder(aci)

const suite = new Benchmark.Suite()

// add tests
suite.add('Encoder#encode(int)', () => {
    encoder.encode(CONTRACT, 'test_single_int', [63])
})

suite.add('Encoder#encode(bool)', () => {
    encoder.encode(CONTRACT, 'test_bool', [true, false])
})

suite.add('Encoder#encode(bytes)', () => {
    encoder.encode(CONTRACT, 'test_bytes', [0xbeef])
})

suite.add('Encoder#encode(string)', () => {
    encoder.encode(CONTRACT, 'test_string', ['whoolymoly'])
})

suite.add('Encoder#encode(hash)', () => {
    encoder.encode(CONTRACT, 'test_hash', [
        '0x000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f',
    ])
})

suite.add('Encoder#encode(signature)', () => {
    encoder.encode(CONTRACT, 'test_signature', [
        `0x000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f`,
    ])
})

suite.add('Encoder#encode(address)', () => {
    encoder.encode(CONTRACT, 'test_account_address', [
        'ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt',
    ])
})

suite.add('Encoder#encode(bits)', () => {
    encoder.encode(CONTRACT, 'test_bits', [[0]])
})

suite.add('Encoder#encode(list)', () => {
    encoder.encode(CONTRACT, 'test_list', [[1, 2, 3, 5, 8, 13, 21]])
})

suite.add('Encoder#encode(map)', () => {
    encoder.encode(CONTRACT, 'test_simple_map', [new Map([[7, false]])])
})

suite.add('Encoder#encode(tuple)', () => {
    encoder.encode(CONTRACT, 'test_tuple', [[true, false]])
})

suite.add('Encoder#encode(variant)', () => {
    encoder.encode(CONTRACT, 'test_variants', [{Yep: [7]}])
})

suite.add('Encoder#encode(record)', () => {
    encoder.encode(CONTRACT, 'test_record', [{x: 0, y: 0}])
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

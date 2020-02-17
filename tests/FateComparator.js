const test = require('ava')
const FateComparator = require('../src/FateComparator.js')

const sort = (type, data, innerType) => {
    data.sort(FateComparator(type, innerType))

    return data
}

test('Compare primitive types', t => {
    t.deepEqual(sort('int', [3, 5, -7, 1, 0]), [-7, 0, 1, 3, 5])

    t.deepEqual(
        sort('bool', [true, false, false, true, true, false]),
        [false, false, false, true, true, true]
    )

    t.deepEqual(
        sort('string', ['Z', 'abc', '~', 'a', 'bab', 'B', 'ab', 'b', 'aa', 'abd', 'abcd']),
        ['~', 'a', 'aa', 'ab', 'abc', 'abcd', 'abd', 'b', 'B', 'bab', 'Z']
    )

    t.deepEqual(
        sort('string', ['Z', 'abc', '~', 'a', 'bab', 'B', 'ab', 'b', 'aa', 'abd', 'abcd']),
        ['~', 'a', 'aa', 'ab', 'abc', 'abcd', 'abd', 'b', 'B', 'bab', 'Z']
    )

    t.deepEqual(
        sort('bits', [-1, 0, -1, 1, 1, 0, -1, 1]),
        [0, 0, 1, 1, 1, -1, -1, -1]
    )
});

test('Compare bytes', t => {
    t.deepEqual(
        sort('bytes', [
            0xfedcba9876543210,
            0x10000000000000000000000000,
            0xdeadfeed,
            0xdeadbeef,
            0xdeadbad,
        ]),
        [
            0xdeadbad,
            0xdeadbeef,
            0xdeadfeed,
            0xfedcba9876543210,
            0x10000000000000000000000000,
        ]
    )

    t.deepEqual(
        sort('bytes', [
            BigInt("0xfedcba9876543210"),
            BigInt("0xdeadfeed"),
            BigInt("0xdeadbeef"),
            BigInt("0xdeadbad"),
        ]),
        [
            BigInt("0xdeadbad"),
            BigInt("0xdeadbeef"),
            BigInt("0xdeadfeed"),
            BigInt("0xfedcba9876543210"),
        ]
    )
});

//TODO support nested inner types
test('Compare lists', t => {
    t.deepEqual(
        sort('list', [
            [],
            [0, 1, 2],
            [0, 1, 2, 3],
            [0, 1],
            [0, 0, 0],
            [0, 1, 2],
            [],
        ], 'int'),
        [
            [],
            [],
            [0, 0, 0],
            [0, 1],
            [0, 1, 2],
            [0, 1, 2],
            [0, 1, 2, 3],
        ]
    )
});

//TODO support nested inner types
test('Compare tuples', t => {
    t.deepEqual(
        sort('tuple', [
            [['bool', true], ['int', 1]],
            [['bool', false], ['int', 1]],
            [['bool', true], ['int', 1]],
            [['bool', false], ['int', 0]],
            [['int', 0]],
        ]),
        [
            [['int', 0]],
            [['bool', false], ['int', 0]],
            [['bool', false], ['int', 1]],
            [['bool', true], ['int', 1]],
            [['bool', true], ['int', 1]],
        ]
    )
});

test('Compare variants', t => {
    t.deepEqual(
        sort('variant', [
            {arities: [0, 0, 1], tag: 2, variantValues: []},
            {arities: [0, 0, 1, 0], tag: 1, variantValues: []},
            {arities: [0, 1, 0], tag: 1, variantValues: []},
            {arities: [1, 1], tag: 1, variantValues: []},
            {arities: [1, 1, 0], tag: 1, variantValues: []},
            {arities: [0, 0, 1], tag: 1, variantValues: []},
            {arities: [0, 0, 1, 0], tag: 1, variantValues: []},
            {arities: [0, 0, 1, 0], tag: 2, variantValues: [['int', 7]]},
            {arities: [0, 0, 1, 0], tag: 2, variantValues: [['int', 0]]},
            {arities: [0, 0, 1, 0], tag: 2, variantValues: [['int', -1]]},
            {arities: [0, 0, 1], tag: 0, variantValues: []},
        ]),
        [
            {arities: [1, 1], tag: 1, variantValues: []},
            {arities: [0, 0, 1], tag: 0, variantValues: []},
            {arities: [0, 0, 1], tag: 1, variantValues: []},
            {arities: [0, 0, 1], tag: 2, variantValues: []},
            {arities: [0, 1, 0], tag: 1, variantValues: []},
            {arities: [1, 1, 0], tag: 1, variantValues: []},
            {arities: [0, 0, 1, 0], tag: 1, variantValues: []},
            {arities: [0, 0, 1, 0], tag: 1, variantValues: []},
            {arities: [0, 0, 1, 0], tag: 2, variantValues: [['int', -1]]},
            {arities: [0, 0, 1, 0], tag: 2, variantValues: [['int', 0]]},
            {arities: [0, 0, 1, 0], tag: 2, variantValues: [['int', 7]]},
        ]
    )
});

test('Compare maps', t => {
    t.deepEqual(
        sort('map', [
            ['int', 'bool', [[1,true], [3,true], [2,false], [0,false]]],
            ['int', 'bool', []],
            ['int', 'bool', [[1,true], [3,true], [0,false]]],
            ['int', 'bool', [[1,true], [3,true], [2,false], [0,false]]],
            ['int', 'bool', [[1,true], [3,true], [2,false], [0,true]]],
            ['int', 'bool', [[1,true], [3,true], [2,true], [0,false]]],
        ]),
        [
            ['int', 'bool', []],
            ['int', 'bool', [[1,true], [3,true], [2,false], [0,false]]],
            ['int', 'bool', [[1,true], [3,true], [2,false], [0,false]]],
            ['int', 'bool', [[1,true], [3,true], [2,true], [0,false]]],
            ['int', 'bool', [[1,true], [3,true], [0,false]]],
            ['int', 'bool', [[1,true], [3,true], [2,false], [0,true]]],
        ]
    )
});

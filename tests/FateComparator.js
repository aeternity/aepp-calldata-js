const test = require('ava')
const FateComparator = require('../src/FateComparator.js')
const {
    FateTypeInt,
    FateTypeBool,
    FateTypeList,
    FateTypeMap,
    FateTypeTuple,
    FateTypeVariant,
} = require('../src/FateTypes.js')


const sort = (type, data) => {
    data.sort(FateComparator(type))

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
    const listType = FateTypeList(FateTypeInt())
    t.deepEqual(
        sort('list', [
            [listType, []],
            [listType, [0, 1, 2]],
            [listType, [0, 1, 2, 3]],
            [listType, [0, 1]],
            [listType, [0, 0, 0]],
            [listType, [0, 1, 2]],
            [listType, []],
        ]),
        [
            [listType, []],
            [listType, []],
            [listType, [0, 0, 0]],
            [listType, [0, 1]],
            [listType, [0, 1, 2]],
            [listType, [0, 1, 2]],
            [listType, [0, 1, 2, 3]],
        ]
    )
});

//TODO support nested inner types
test('Compare tuples', t => {
    const tupleType = FateTypeTuple([FateTypeBool(), FateTypeInt()])
    t.deepEqual(
        sort('tuple', [
            [tupleType, [true, 1]],
            [tupleType, [false, 1]],
            [tupleType, [true, 1]],
            [tupleType, [false, 0]],
            [FateTypeTuple([FateTypeInt()]), [0]],
        ]),
        [
            [FateTypeTuple([FateTypeInt()]), [0]],
            [tupleType, [false, 0]],
            [tupleType, [false, 1]],
            [tupleType, [true, 1]],
            [tupleType, [true, 1]],
        ]
    )
});

test('Compare variants', t => {
    t.deepEqual(
        sort('variant', [
            [
                FateTypeVariant([0, 0, 1], []),
                {tag: 2, variantValues: []}
            ],
            [
                FateTypeVariant([0, 0, 1, 0], []),
                {tag: 1, variantValues: []}
            ],
            [
                FateTypeVariant([0, 1, 0], []),
                {tag: 1, variantValues: []}
            ],
            [
                FateTypeVariant([1, 1], []),
                {tag: 1, variantValues: []}
            ],
            [
                FateTypeVariant([1, 1, 0], []),
                {tag: 1, variantValues: []}
            ],
            [
                FateTypeVariant([0, 0, 1], []),
                {tag: 1, variantValues: []}
            ],
            [
                FateTypeVariant([0, 0, 1, 0], []),
                {tag: 1, variantValues: []}
            ],
            [
                FateTypeVariant([0, 0, 1, 0], [FateTypeInt()]),
                {tag: 2, variantValues: [7]}
            ],
            [
                FateTypeVariant([0, 0, 1, 0], [FateTypeInt()]),
                {tag: 2, variantValues: [0]}
            ],
            [
                FateTypeVariant([0, 0, 1, 0], [FateTypeInt()]),
                {tag: 2, variantValues: [-1]}
            ],
            [
                FateTypeVariant([0, 0, 1], []),
                {tag: 0, variantValues: []}
            ],
        ]),
        [
            [
                FateTypeVariant([1, 1], []),
                {tag: 1, variantValues: []}
            ],
            [
                FateTypeVariant([0, 0, 1], []),
                {tag: 0, variantValues: []}
            ],
            [
                FateTypeVariant([0, 0, 1], []),
                {tag: 1, variantValues: []}
            ],
            [
                FateTypeVariant([0, 0, 1], []),
                {tag: 2, variantValues: []}
            ],
            [
                FateTypeVariant([0, 1, 0], []),
                {tag: 1, variantValues: []}
            ],
            [
                FateTypeVariant([1, 1, 0], []),
                {tag: 1, variantValues: []}
            ],
            [
                FateTypeVariant([0, 0, 1, 0], []),
                {tag: 1, variantValues: []}
            ],
            [
                FateTypeVariant([0, 0, 1, 0], []),
                {tag: 1, variantValues: []}
            ],
            [
                FateTypeVariant([0, 0, 1, 0], [FateTypeInt()]),
                {tag: 2, variantValues: [-1]}
            ],
            [
                FateTypeVariant([0, 0, 1, 0], [FateTypeInt()]),
                {tag: 2, variantValues: [0]}
            ],
            [
                FateTypeVariant([0, 0, 1, 0], [FateTypeInt()]),
                {tag: 2, variantValues: [7]}
            ],
        ]
    )
});

test('Compare maps', t => {
    const mapType = FateTypeMap(FateTypeInt(), FateTypeBool())
    t.deepEqual(
        sort('map', [
            [mapType, [[1,true], [3,true], [2,false], [0,false]]],
            [mapType, []],
            [mapType, [[1,true], [3,true], [0,false]]],
            [mapType, [[1,true], [3,true], [2,false], [0,false]]],
            [mapType, [[1,true], [3,true], [2,false], [0,true]]],
            [mapType, [[1,true], [3,true], [2,true], [0,false]]],
        ]),
        [
            [mapType, []],
            [mapType, [[1,true], [3,true], [2,false], [0,false]]],
            [mapType, [[1,true], [3,true], [2,false], [0,false]]],
            [mapType, [[1,true], [3,true], [2,true], [0,false]]],
            [mapType, [[1,true], [3,true], [0,false]]],
            [mapType, [[1,true], [3,true], [2,false], [0,true]]],
        ]
    )
});

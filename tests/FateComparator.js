const test = require('ava')
const FateComparator = require('../src/FateComparator.js')
const FateList = require('../src/types/FateList.js')
const FateMap = require('../src/types/FateMap.js')
const FateTuple = require('../src/types/FateTuple.js')
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

const FTInt = FateTypeInt(), FTBool = FateTypeBool()

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
        sort(FateTypeList(FateTypeInt()), [
            new FateList(FateTypeInt()),
            new FateList(FateTypeInt(), [0,1,2]),
            new FateList(FateTypeInt(), [0,1,2,3]),
            new FateList(FateTypeInt(), [0,1]),
            new FateList(FateTypeInt(), [0,0,0]),
            new FateList(FateTypeInt(), [0,1,2]),
            new FateList(FateTypeInt()),
        ]),
        [
            new FateList(FateTypeInt()),
            new FateList(FateTypeInt()),
            new FateList(FateTypeInt(), [0,0,0]),
            new FateList(FateTypeInt(), [0,1]),
            new FateList(FateTypeInt(), [0,1,2]),
            new FateList(FateTypeInt(), [0,1,2]),
            new FateList(FateTypeInt(), [0,1,2,3]),
        ]
    )
});

//TODO support nested inner types
test('Compare tuples', t => {
    t.deepEqual(
        sort(FateTypeTuple(), [
            new FateTuple([FTBool, FTInt], [true, 1]),
            new FateTuple([FTBool, FTInt], [false, 1]),
            new FateTuple([FTBool, FTInt], [true, 1]),
            new FateTuple([FTBool, FTInt], [false, 0]),
            new FateTuple([FTInt], [0]),
        ]),
        [
            new FateTuple([FTInt], [0]),
            new FateTuple([FTBool, FTInt], [false, 0]),
            new FateTuple([FTBool, FTInt], [false, 1]),
            new FateTuple([FTBool, FTInt], [true, 1]),
            new FateTuple([FTBool, FTInt], [true, 1]),
        ]
    )
});

test('Compare variants', t => {
    t.deepEqual(
        sort(FateTypeVariant(), [
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
    t.deepEqual(
        sort(FateTypeMap(FTInt, FTBool), [
            new FateMap(FTInt, FTBool, [[1,true], [3,true], [2,false], [0,false]]),
            new FateMap(FTInt, FTBool, []),
            new FateMap(FTInt, FTBool, [[1,true], [3,true], [0,false]]),
            new FateMap(FTInt, FTBool, [[1,true], [3,true], [2,false], [0,false]]),
            new FateMap(FTInt, FTBool, [[1,true], [3,true], [2,false], [0,true]]),
            new FateMap(FTInt, FTBool, [[1,true], [3,true], [2,true], [0,false]]),
        ]),
        [
            new FateMap(FTInt, FTBool, []),
            new FateMap(FTInt, FTBool, [[1,true], [3,true], [2,false], [0,false]]),
            new FateMap(FTInt, FTBool, [[1,true], [3,true], [2,false], [0,false]]),
            new FateMap(FTInt, FTBool, [[1,true], [3,true], [2,true], [0,false]]),
            new FateMap(FTInt, FTBool, [[1,true], [3,true], [0,false]]),
            new FateMap(FTInt, FTBool, [[1,true], [3,true], [2,false], [0,true]]),
        ]
    )
});

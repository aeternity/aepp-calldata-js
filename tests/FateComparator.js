const test = require('./test')
const FateComparator = require('../src/FateComparator')
const FateInt = require('../src/types/FateInt')
const FateBool = require('../src/types/FateBool')
const FateString = require('../src/types/FateString')
const FateList = require('../src/types/FateList')
const FateMap = require('../src/types/FateMap')
const FateTuple = require('../src/types/FateTuple')
const FateVariant = require('../src/types/FateVariant')
const FateBytes = require('../src/types/FateBytes')
const FateBits = require('../src/types/FateBits')
const {
    FateTypeInt,
    FateTypeBool,
    FateTypeString,
    FateTypeBits,
    FateTypeBytes,
    FateTypeList,
    FateTypeMap,
    FateTypeTuple,
    FateTypeVariant,
} = require('../src/FateTypes')


const sort = (type, data) => {
    data.sort(FateComparator(type))

    return data
}

const FTInt = FateTypeInt(), FTBool = FateTypeBool()

test('Compare primitive types', t => {
    t.plan(5)
    t.deepEqual(
        sort(FateTypeInt(), [3, new FateInt(3), 5, -7, 1, 0]),
        [-7, 0, 1, 3, new FateInt(3), 5]
    )

    t.deepEqual(
        sort(FateTypeBool(), [true, false, false, new FateBool(true), true, true, false]),
        [false, false, false, true, new FateBool(true), true, true]
    )

    t.deepEqual(
        sort(FateTypeString(), ['Z', 'abc', '~', 'a', 'bab', new FateString('bab'), 'B', 'ab', 'b', 'aa', 'abd', 'abcd']),
        ['~', 'a', 'aa', 'ab', 'abc', 'abcd', 'abd', 'b', 'B', 'bab', new FateString('bab'), 'Z']
    )

    t.deepEqual(
        sort(FateTypeString(), ['Z', 'abc', '~', 'a', 'bab', 'B', 'ab', 'b', 'aa', 'abd', 'abcd']),
        ['~', 'a', 'aa', 'ab', 'abc', 'abcd', 'abd', 'b', 'B', 'bab', 'Z']
    )

    t.deepEqual(
        sort(FateTypeBits(), [-1, 0, -1, new FateBits(0), 1, 1, new FateBits(1), 0, -1, 1]),
        [0, new FateBits(0), 0, 1, 1, new FateBits(1), 1, -1, -1, -1]
    )
});

test('Compare bytes', t => {
    t.plan(2)
    t.deepEqual(
        sort(FateTypeBytes(), [
            new FateBytes(0xfedcba9876543210),
            new FateBytes(0x10000000000000000000000000),
            new FateBytes(0xdeadfeed),
            new FateBytes(0xdeadbeef),
            new FateBytes(0x0deadbad),
        ]),
        [
            new FateBytes(0x0deadbad),
            new FateBytes(0x10000000000000000000000000),
            new FateBytes(0xdeadbeef),
            new FateBytes(0xdeadfeed),
            new FateBytes(0xfedcba9876543210),
        ]
    )

    t.deepEqual(
        sort(FateTypeBytes(), [
            new FateBytes("0xfedcba9876543210"),
            new FateBytes("0xdeadfeed"),
            new FateBytes("0xdeadbeef"),
            new FateBytes("0xdeadbad"),
        ]),
        [
            new FateBytes("0xdeadbad"),
            new FateBytes("0xdeadbeef"),
            new FateBytes("0xdeadfeed"),
            new FateBytes("0xfedcba9876543210"),
        ]
    )
});

//TODO support nested inner types
test('Compare lists', t => {
    t.plan(1)
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
    t.plan(1)
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
    t.plan(1)
    t.deepEqual(
        sort(FateTypeVariant(), [
            new FateVariant([0, 0, 1], 2),
            new FateVariant([0, 0, 1, 0], 1),
            new FateVariant([0, 1, 0], 1),
            new FateVariant([1, 1], 1),
            new FateVariant([1, 1, 0], 1),
            new FateVariant([0, 0, 1], 1),
            new FateVariant([0, 0, 1, 0], 1),
            new FateVariant([0, 0, 1, 0], 2, [7], [FateTypeInt()]),
            new FateVariant([0, 0, 1, 0], 2, [0], [FateTypeInt()]),
            new FateVariant([0, 0, 1, 0], 2, [-1], [FateTypeInt()]),
            new FateVariant([0, 0, 1], 0),
        ]),
        [
            new FateVariant([1, 1], 1),
            new FateVariant([0, 0, 1], 0),
            new FateVariant([0, 0, 1], 1),
            new FateVariant([0, 0, 1], 2),
            new FateVariant([0, 1, 0], 1),
            new FateVariant([1, 1, 0], 1),
            new FateVariant([0, 0, 1, 0], 1),
            new FateVariant([0, 0, 1, 0], 1),
            new FateVariant([0, 0, 1, 0], 2, [-1], [FateTypeInt()]),
            new FateVariant([0, 0, 1, 0], 2, [0], [FateTypeInt()]),
            new FateVariant([0, 0, 1, 0], 2, [7], [FateTypeInt()]),
        ]
    )
});

test('Compare maps', t => {
    t.plan(1)
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

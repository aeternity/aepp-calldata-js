const test = require('ava')
const Serializer = require('../../src/Serializer.js')
const MapSerializer = require('../../src/Serializers/MapSerializer.js')
const FateMap = require('../../src/types/FateMap.js')
const {FateTypeInt, FateTypeBool} = require('../../src/FateTypes.js')

const s = new MapSerializer(Object.create(Serializer))

test('Serialize', t => {
    const FTInt = FateTypeInt()
    const FTBool = FateTypeBool()

    t.deepEqual(
        s.serialize(new FateMap(FTInt, FTBool, [])),
        [47,0],
        'empty map'
    )

    t.deepEqual(
        s.serialize(new FateMap(FTInt, FTBool, [[0, false]])),
        [47,1,0,127],
        'single element map'
    )

    t.deepEqual(
        s.serialize(new FateMap(FTInt, FTBool, [[0,false], [1,true], [3,true]])),
        [47,3,0,127,2,255,6,255]
    )

    t.deepEqual(
        s.serialize(new FateMap(FTInt, FTBool, [[3,false], [5,true], [1,true]])),
        [47,3,2,255,6,127,10,255]
    )
});

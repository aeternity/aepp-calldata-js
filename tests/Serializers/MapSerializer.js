const test = require('ava')
const {FateTypeInt, FateTypeBool, FateTypeMap} = require('../../src/FateTypes.js')
const Serializer = require('../../src/Serializer.js')
const MapSerializer = require('../../src/Serializers/MapSerializer.js')

const s = new MapSerializer(Object.create(Serializer))

test('Serialize', t => {
    const mapType = FateTypeMap(FateTypeInt(), FateTypeBool())

    t.deepEqual(s.serialize([mapType, []]), [47,0], 'empty map')

    t.deepEqual(
        s.serialize([mapType, [[0, false]]]),
        [47,1,0,127],
        'single element map'
    )

    t.deepEqual(
        s.serialize([mapType, [[0,false], [1,true], [3,true]]]),
        [47,3,0,127,2,255,6,255]
    )

    t.deepEqual(
        s.serialize([mapType, [[3,false], [5,true], [1,true]]]),
        [47,3,2,255,6,127,10,255]
    )
});

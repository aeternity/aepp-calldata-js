const test = require('ava')
const Serializer = require('../../src/Serializer.js')
const MapSerializer = require('../../src/Serializers/MapSerializer.js')

const s = new MapSerializer(Object.create(Serializer))

test('Serialize', t => {
    t.deepEqual(s.serialize(['int', 'bool', []]), [47,0], 'empty map')

    t.deepEqual(
        s.serialize(['int', 'bool', [[0, false]]]),
        [47,1,0,127],
        'single element map'
    )

    t.deepEqual(
        s.serialize(['int', 'bool', [[0,false], [1,true], [3,true]]]),
        [47,3,0,127,2,255,6,255]
    )
});

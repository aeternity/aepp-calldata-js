const fs = require('fs')
const path = require('path')
const test = require('./test')
const aci = require('../build/contracts/Test.json')
const {
    Encoder,
    AciContractCallEncoder,
    BytecodeContractCallEncoder,
    ContractByteArrayEncoder
} = require('../src/main')

const CONTRACT = 'Test'

test('Encoder (legacy) public API', t => {
    t.plan(6)
    const encoder = new Encoder(aci)
    const error = 'cb_VHlwZSBlcnJvciBvbiBjYWxsOiBbe2J5dGVzLDw8MjQwLDIsLi4uPj59XSBpcyBub3Qgb2YgdHlwZSBbe2J5dGVzLDMyfV3EtJjU'

    t.is(encoder.encode(CONTRACT, 'init', []), 'cb_KxFE1kQfP4oEp9E=', 'init()')
    t.is(encoder.decode(CONTRACT, 'init', 'cb_Xfbg4g=='), undefined)
    t.is(encoder.decodeContractByteArray('cb_/8CwV/U='), true)
    t.is(encoder.decodeFateString('cb_OXJlcXVpcmUgZmFpbGVkarP9mg=='), 'require failed')
    t.is(encoder.decodeString(error).toString(), 'Type error on call: [{bytes,<<240,2,...>>}] is not of type [{bytes,32}]')

    t.deepEqual(
        encoder.decodeEvent(
            CONTRACT,
            'cb_dHJpZ2dlcmVk1FYuYA==',
            [
                34853523142692495808479485503424878684430196596020091237715106250497712463899n,
                17
            ]
        ),
        {EventTwo: [17n, 'triggered']}
    )
})

test('AciContractCallEncoder public API', t => {
    t.plan(4)
    const encoder = new AciContractCallEncoder(aci)

    t.is(encoder.encodeCall(CONTRACT, 'init', []), 'cb_KxFE1kQfP4oEp9E=')
    t.is(encoder.decodeResult(CONTRACT, 'init', 'cb_Xfbg4g=='), undefined)

    t.deepEqual(
        encoder.decodeCall(CONTRACT, 'test_bool', 'cb_KxGhC8WIK/9/56SENg=='),
        {functionId: 'a10bc588', args: [true, false]}
    )

    t.deepEqual(
        encoder.decodeEvent(
            CONTRACT,
            'cb_dHJpZ2dlcmVk1FYuYA==',
            [
                34853523142692495808479485503424878684430196596020091237715106250497712463899n,
                17
            ]
        ),
        {EventTwo: [17n, 'triggered']}
    )
})

test('BytecodeContractCallEncoder public API', t => {
    t.plan(1)

    const bytecode = fs.readFileSync(path.resolve(__dirname, '../build/contracts/Test.aeb'))
    const encoder = new BytecodeContractCallEncoder(bytecode.toString())

    t.is(encoder.encodeCall('init', []), 'cb_KxFE1kQfP4oEp9E=')
    t.is(encoder.decodeResult('init', 'cb_Xfbg4g=='), undefined)

    t.deepEqual(
        encoder.decodeCall('cb_KxGhC8WIK/9/56SENg=='),
        {functionId: 'a10bc588', functionName: 'test_bool', args: [true, false]}
    )
})

test('ContractByteArrayEncoder public API', t => {
    t.plan(1)

    const encoder = new ContractByteArrayEncoder()

    t.is(encoder.decode('cb_b4MC7W/bKkpn'), 191919n, 'int')
})

const fs = require('fs')
const Coder = require('./Coder.js')


const aci = JSON.parse(fs.readFileSync('build/identity.json', 'utf-8'))
const contractAci = aci[0].contract
const coder = Object.create(Coder)

console.log(
    "calldata init()",
    coder.encode(contractAci, "init", [])
)

console.log(
    "calldata main(true, false)",
    coder.encode(contractAci, "main", [true, false])
)

console.log(
    "calldata main(false, true)",
    coder.encode(contractAci, "main", [false, true])
)

console.log(
    "calldata main2(42)",
    coder.encode(contractAci, "main", [42])
)

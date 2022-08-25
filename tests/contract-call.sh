#!/bin/bash

set -eu -o pipefail

# Examples:
# contract-call.sh test_empty
# contract-call.sh test_bool "[true, false]"

CONTRACT_SRC="contracts/Test.aes"
DESCRIPTOR_SRC="build/${CONTRACT_SRC//.aes/.desc.json}"
WALLET_PATH="build/wallet"
WALLET_PASS="123"
# init() calldata
CALLDATA="[]"

if ! npx aecli account address -P $WALLET_PASS $WALLET_PATH > /dev/null; then
    ACCOUNT=$(npx aecli account create --json -P $WALLET_PASS $WALLET_PATH | jq -r '.publicKey')
    curl -sS -X POST https://faucet.aepps.com/account/$ACCOUNT > /dev/null
fi

if ! npx aecli account balance -P $WALLET_PASS $WALLET_PATH > /dev/null; then
    echo "Please feed the wallet"
    npx aecli account address -P $WALLET_PASS $WALLET_PATH
fi

if [ ! -f $DESCRIPTOR_SRC ]; then
    npx aecli contract deploy \
        --json -P $WALLET_PASS --descrPath $DESCRIPTOR_SRC --networkId ae_uat \
        $WALLET_PATH --contractSource $CONTRACT_SRC $CALLDATA > /dev/null
fi

function contract_call() {
    echo -n "$1(${@:2}) -> "
    npx aecli contract call \
        --networkId ae_uat --password $WALLET_PASS --json \
        --descrPath $DESCRIPTOR_SRC \
        $WALLET_PATH \
        "$@" | jq -r '.result.returnValue'
}

contract_call "$@"

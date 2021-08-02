#!/bin/bash

set -eu -o pipefail

CONTRACT_SRC="contracts/Test.aes"
ADDRESS_SRC="build/${CONTRACT_SRC//.aes/.addr}"
WALLET_PATH="build/wallet"
WALLET_PASS="123"
CALLDATA="cb_KxFE1kQfP4oEp9E="

if ! aecli account address -P $WALLET_PASS $WALLET_PATH > /dev/null; then
    ACCOUNT=$(aecli account create --json -P $WALLET_PASS $WALLET_PATH | jq -r '.publicKey')
    curl -sS -X POST https://faucet.aepps.com/account/$ACCOUNT > /dev/null
fi

if ! aecli account balance -P $WALLET_PASS $WALLET_PATH > /dev/null; then
    echo "Please feed the wallet"
    aecli account address -P $WALLET_PASS $WALLET_PATH
fi

if [ ! -f $ADDRESS_SRC ]; then
    RESULT=$(aecli contract deploy --json -P $WALLET_PASS --networkId ae_uat $WALLET_PATH $CONTRACT_SRC $CALLDATA)
    rm $(echo $RESULT | jq -r '.descPath')
    echo $RESULT | jq -r '.address' > $ADDRESS_SRC
fi

CONTRACT_ADDR=$(cat $ADDRESS_SRC)

function contract_call() {
    echo -n "$1(${@:2}) -> "
    aecli contract call \
        --networkId ae_uat --password $WALLET_PASS --json \
        --contractAddress $CONTRACT_ADDR \
        --contractSource $CONTRACT_SRC \
        $WALLET_PATH \
        "$@" | jq -r '.result.returnValue'
}

contract_call "$@"

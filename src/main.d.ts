/**
 * @deprecated Use AciContractCallEncoder
 */
export class Encoder {
  constructor(aci: any[]);

  encode(contract: string, funName: string, args: any[]): `cb_${string}`;

  decode(contract: string, funName: string, data: `cb_${string}`): any;

  decodeContractByteArray(data: `cb_${string}`): any;

  decodeString(data: `cb_${string}`): Uint8Array;

  decodeFateString(data: `cb_${string}`): string;

  decodeEvent(
      contract: string,
      encodedData: `cb_${string}`,
      topics: BigInt[],
  ): { [key: string]: any[] };
}

export class AciContractCallEncoder {
  constructor(aci: any[]);

  encodeCall(contract: string, funName: string, args: any[]): `cb_${string}`;

  decodeCall(contract: string, funName: string, data: `cb_${string}`): any;

  decodeResult(
    contract: string,
    funName: string,
    data: `cb_${string}`,
    resultType?: 'ok' | 'revert' | 'error'
  ): any;

  decodeEvent(
    contract: string,
    data: `cb_${string}`,
    topics: BigInt[]
  ): { [key: string]: any[] };
}

export class BytecodeContractCallEncoder {
  constructor(bytecode: `cb_${string}`);

  encodeCall(funName: string, args: any[]): `cb_${string}`;

  decodeCall(data: `cb_${string}`): object;

  decodeResult(
    funName: string,
    data: `cb_${string}`,
    resultType?: 'ok' | 'revert' | 'error'
  ): any;
}

export class ContractByteArrayEncoder {
  decode(data: `cb_${string}`): any;
}

export class FateApiEncoder {
  encode(
    type: 'contract_bytearray' | 'contract_pubkey' | 'account_address' | 'channel' | 'oracle_pubkey' | 'oracle_query_id',
    data: Uint8Array
  ): string;
  decode(data: `${'cb' | 'ct' | 'ak' | 'ch' | 'ok' | 'oq'}_${string}`): Uint8Array;
}

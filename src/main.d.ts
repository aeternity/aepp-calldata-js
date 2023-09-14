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
  encodeWithType(value: any, type: object): `cb_${string}`;
  decode(data: `cb_${string}`): any;
  decodeWithType(data: `cb_${string}`, type: object): any;
}

declare type TYPE2TAG = {
  contract_bytearray: 'cb',
  contract_pubkey: 'ct',
  account_pubkey: 'ak',
  channel: 'ch',
  oracle_pubkey: 'ok',
  oracle_query_id: 'oq',
};

export class FateApiEncoder {
  encode<Type extends keyof TYPE2TAG>(type: Type, data: Uint8Array): `${TYPE2TAG[Type]}_${string}`;
  decode(data: `${TYPE2TAG[keyof TYPE2TAG]}_${string}`): Uint8Array;
}

export class ContractEncoder {
  decode(data: `cb_${string}`): object;
}

export class TypeResolver {
  resolveType(type: string | object, vars?: object): object;
}

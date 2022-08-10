export class Encoder {
  constructor(aci: { [key: string]: any });

  encode(contract: string, funName: string, args: any[]): `cb_${string}`;

  decode(contract: string, funName: string, data: `cb_${string}`): any;

  decodeString(data: `cb_${string}`): Uint8Array;

  decodeFateString(data: `cb_${string}`): string;

  decodeEvent(
      contract: string,
      encodedData: `cb_${string}`,
      topics: BigInt[],
  ): { [key: string]: any[] };
}

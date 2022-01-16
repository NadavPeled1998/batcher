import abiDecoder from "abi-decoder";
import { TokenType } from "../store/prices";
import erc20Abi from "./erc20.json";
import erc721Abi from "./erc721.json";
import multiSendAbi from "./multiSend.json";
import { MultiSendMethodNames } from "./types/MultiSend";

abiDecoder.addABI(multiSendAbi);
abiDecoder.addABI(erc20Abi);
abiDecoder.addABI(erc721Abi);

interface Param {
  name: string;
  type: string;
  value: string[];
}

interface DecodedInput {
  name: MultiSendMethodNames;
  params: Param[];
}

export interface SerializedItem {
  receiver: string;
  amount: string;
  token_address: string;
  type: TokenType;
}

const params: (keyof SerializedItem)[] = [
  "receiver",
  "amount",
  "token_address",
  "type",
];

const serialize = (func: DecodedInput) => {
  return func.params.reduce((acc, { value }, i) => {
    value.forEach((v, j) => {
      if (!acc[j]) acc[j] = { type: "native" } as any;
      acc[j] = {
        ...acc[j],
        [params[i]]: v,
      };
    });
    return acc;
  }, [] as SerializedItem[]);
};

export const decodeInput = (input: string): SerializedItem[] | undefined => {
  try {
    return serialize(abiDecoder.decodeMethod(input));
  } catch (error) {
    return;
  }
};

export default abiDecoder;

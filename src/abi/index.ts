import abiDecoder from "abi-decoder";
import { TokenType } from "../store/prices";
import { NATIVE_ADDRESS_0xE } from "../utils/network";
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

export interface DecodedTransfer {
  receiver: string;
  amount: string;
  token_address: string;
  type: TokenType;
}

const defaultTransfer = (): Partial<DecodedTransfer> => ({
  type: "native",
  token_address: NATIVE_ADDRESS_0xE,
});

const PARAMS: (keyof DecodedTransfer)[] = [
  "receiver",
  "amount",
  "token_address",
  "type",
];

// native and erc20
// TODO: add erc721
const decodeTransfers = (func: DecodedInput) => {
  return func.params.reduce((acc, { value }, i) => {
    value.forEach((v, j) => {
      if (!acc[j]) acc[j] = defaultTransfer() as DecodedTransfer;
      acc[j] = {
        ...acc[j],
        [PARAMS[i]]: v,
      };
    });
    return acc;
  }, [] as DecodedTransfer[]);
};

export const decodeInput = (input: string): DecodedTransfer[] | undefined => {
  try {
    const decoded = abiDecoder.decodeMethod(input);
    return decodeTransfers(decoded);
  } catch (error) {
    return;
  }
};

export default abiDecoder;

import abiDecoder from "abi-decoder";
import { tokenMetaDataType } from "../store/tokens";
import { isNative } from "../utils/address";
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
  type: tokenMetaDataType;
}

const defaultTransfer = (): Partial<DecodedTransfer> => ({
  type: tokenMetaDataType.NATIVE,
  token_address: NATIVE_ADDRESS_0xE,
});

const PARAMS: (keyof DecodedTransfer)[] = [
  "receiver",
  "amount",
  "token_address",
  "type",
];

const decodeTransfers = (func: DecodedInput) => {
  return func.params.reduce((acc, { value }, i) => {
    value.forEach((v, j) => {
      if (!acc[j]) acc[j] = defaultTransfer() as DecodedTransfer;
      acc[j] = {
        ...acc[j],
        [PARAMS[i]]: v,
      };
      if(isNative(acc[j].token_address) || !acc[j].token_address || acc[j].type == 1) {
        acc[j].type = tokenMetaDataType.NATIVE
      }
      else if(func.name.includes('ERC20') || acc[j].type == 2) {
        acc[j].type = tokenMetaDataType.ERC20
      }
      else if(func.name.includes('ERC721') || acc[j].type == 3) {
        acc[j].type = tokenMetaDataType.ERC721        
      }
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

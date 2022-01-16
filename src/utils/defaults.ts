import { Token } from "../hooks/useERC20Balance";
import { TokenMetaData } from "../store/tokens";
import { NATIVE_ADDRESS_0xE } from "./network";

export const genDefaultETHToken = (): Token => {
  return {
    token_address: NATIVE_ADDRESS_0xE,
    decimals: "18",
    symbol: "ETH",
    name: "Ethereum",
    balance: "0",
    logo: undefined,
    thumbnail: undefined,
    type: "native",
  };
};

export const generateNativeTokenMetaData = (): TokenMetaData => {
  return {
    address: NATIVE_ADDRESS_0xE,
    decimals: "18",
    symbol: "ETH",
    name: "Ethereum",
    logo: undefined,
    thumbnail: undefined,
  };
};

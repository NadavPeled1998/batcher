import { Token } from "../hooks/useERC20Balance";
import { TokenMetaData } from "../store/tokens";
import { NATIVE_ADDRESS_0xE } from "./network";

interface IDefaultCurrency {
 symbol: string;
 name: string;
}
type defaultCurrencies = { [key in string]: IDefaultCurrency };

const DEFAULT_CURRENCIES: defaultCurrencies = {
  '0x4': {
    symbol: "ETH",
    name: "Ethereum",
  },
  '0xa869': {
    symbol: "AVAX",
    name: "Avalanche-2",
  }
}

export const genDefaultETHToken = (chainId?: string | null): Token => {
  const defaultCurrency = DEFAULT_CURRENCIES[chainId || "0xa869"]
  return {
    token_address: NATIVE_ADDRESS_0xE,
    decimals: "18",
    symbol:defaultCurrency?.symbol,
    name: defaultCurrency?.name,
    balance: "0",
    logo: undefined,
    thumbnail: undefined,
    type: "native",
  };
};

export const generateNativeTokenMetaData = (chainId?: string | null): TokenMetaData => {
  const defaultCurrency = DEFAULT_CURRENCIES[chainId || "0xa869"]

  return {
    address: NATIVE_ADDRESS_0xE,
    decimals: "18",
    symbol: defaultCurrency?.symbol,
    name: defaultCurrency?.name,
    logo: undefined,
    thumbnail: undefined,
    type: "native",
  };
};

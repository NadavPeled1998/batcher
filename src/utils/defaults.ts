import { Token } from "../store/prices";
import { TokenMetaData } from "../store/tokens";
import { NATIVE_ADDRESS_0xE } from "./network";
import avaxIcon from '../assets/avax.png' 

interface IDefaultCurrency {
 symbol: string;
 name: string;
 logo?: string
}
type defaultCurrencies = { [key in string]: IDefaultCurrency };

const DEFAULT_CURRENCIES: defaultCurrencies = {
  '0x4': {
    symbol: "ETH",
    name: "Ethereum",
    logo: undefined,
  },
  '0xa869': {
    symbol: "AVAX",
    name: "Avalanche-2",
    logo: avaxIcon
  },
  '0xa86a': {
    symbol: "AVAX",
    name: "Avalanche-2",
    logo: avaxIcon
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
    logo: defaultCurrency?.logo,
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
    logo: defaultCurrency?.logo,
    thumbnail: undefined,
    type: "native",
  };
};

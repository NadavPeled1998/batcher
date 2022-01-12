import {
  UseNativeBalancesParams
} from "react-moralis";
export interface Token {
  token_address: string;
  name: string;
  symbol: string;
  logo?: string | undefined;
  thumbnail?: string | undefined;
  decimals: string;
  balance: string;
}

export type ChainID = UseNativeBalancesParams["chain"];


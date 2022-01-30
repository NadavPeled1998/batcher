import { makeAutoObservable } from "mobx";
import Moralis from "moralis";
import { ChainID } from "../hooks/useERC20Balance";
import { makePersistable } from "mobx-persist-store";
import { generateNativeTokenMetaData } from "../utils/defaults";
import { NATIVE_ADDRESS_0x0, NATIVE_ADDRESS_0xE } from "../utils/network";
import { isNative } from "../utils/address";
import { ResNFT } from "./nfts";
import { awesomePromise } from "../utils/promise";

export interface TokenMetaData {
  address: string;
  name: string;
  symbol: string;
  decimals: string;
  logo?: string;
  logo_hash?: string;
  thumbnail?: string;
  block_number?: string;
  validated?: string;
  type?: "erc20" | "erc721" | "native";
}

export type TokensMetaDataMap = {
  [token_address: string]: TokenMetaData;
};

export type NFTMetaDataMap = {
  [nft_token_address: string]: {
    [nft_token_id: string]: ResNFT;
  };
};

export class Tokens {
  tokensMap: TokensMetaDataMap = {
    [NATIVE_ADDRESS_0xE]: generateNativeTokenMetaData(),
    [NATIVE_ADDRESS_0x0]: generateNativeTokenMetaData(),
  };

  nftsMap: NFTMetaDataMap = {};

  get native() {
    return this.tokensMap[NATIVE_ADDRESS_0xE];
  }

  get tokens() {
    return Object.values(this.tokensMap);
  }

  get nfts() {
    return Object.values(this.nftsMap).map((nft) => Object.values(nft));
  }

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: "TokensStore",
      properties: ["tokensMap"],
      storage: window.localStorage,
    });
  }

  filterUnfetched(addresses: string[]) {
    return addresses.filter((address) => !this.tokensMap[address]);
  }

  async fetchTokensMetaData(addresses: string[], chainId: ChainID) {
    const unFetched = this.filterUnfetched(addresses);
    if (unFetched.length === 0) return;
    
    const [tokens, error] = await awesomePromise(
      Moralis.Web3API.token.getTokenMetadata({
        addresses: unFetched,
        chain: chainId,
      })
    );


    if(error) {
      console.error("error fetching tokens metadata:", error);
      return;
    }

    this.add(tokens!)
  }

  add(token: TokenMetaData | TokenMetaData[]) {
    if (Array.isArray(token)) {
      token.forEach((t) => this.add(t));
    } else {
      this.tokensMap[token.address] = {
        ...token,
        type: isNative(token.address) ? "native" : "erc20",
      };
    }
  }

  get(address: string) {
    return this.tokensMap[address];
  }

  getBySymbol(symbol: string) {
    return this.tokens.find((token) => token.symbol === symbol);
  }
}
export const tokensStore = new Tokens();

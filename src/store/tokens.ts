import { makeAutoObservable } from "mobx";
import Moralis from "moralis";
import { ChainID } from "../hooks/useERC20Balance";
import { makePersistable } from "mobx-persist-store";
import { generateNativeTokenMetaData } from "../utils/defaults";
import { NATIVE_ADDRESS_0x0, NATIVE_ADDRESS_0xE } from "../utils/network";

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
  [key: string]: TokenMetaData;
};

export class Tokens {
  tokensMap: TokensMetaDataMap = {
    [NATIVE_ADDRESS_0xE]: generateNativeTokenMetaData(),
    [NATIVE_ADDRESS_0x0]: generateNativeTokenMetaData(),
  };

  get tokens() {
    return Object.values(this.tokensMap);
  }

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: "TokensStore",
      properties: ["tokensMap"],
      storage: window.localStorage,
    });
  }

  filterUnFetched(addresses: string[]) {
    return addresses.filter((address) => !this.tokensMap[address]);
  }

  async fetchTokensMetaData(addresses: string[], chainId: ChainID) {
    const unfetched = this.filterUnFetched(addresses);
    if (unfetched.length === 0) return console.log("all tokens are fetched");

    await Moralis.Web3API.token
      .getTokenMetadata({
        addresses: unfetched,
        chain: chainId,
      })
      .then((data) => this.add(data))
      .catch((e) => console.error("fetch tokens metadata failed", e));
  }

  add(token: TokenMetaData | TokenMetaData[]) {
    if (Array.isArray(token)) {
      token.forEach((t) => this.add(t));
    } else {
      this.tokensMap[token.address] = token;
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

import { makeAutoObservable } from "mobx";
import Moralis from "moralis";
import { ChainID } from "./prices";
import { makePersistable } from "mobx-persist-store";
import { generateNativeTokenMetaData } from "../utils/defaults";
import { NATIVE_ADDRESS_0x0, NATIVE_ADDRESS_0xE } from "../utils/network";
import { isNative } from "../utils/address";

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
    [NATIVE_ADDRESS_0xE]: generateNativeTokenMetaData('0xa869'),
    [NATIVE_ADDRESS_0x0]: generateNativeTokenMetaData('0xa869'),
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
    const unFetched = this.filterUnFetched(addresses);
    if (unFetched.length === 0) return;

    await Moralis.Web3API.token
      .getTokenMetadata({
        addresses,
        chain: chainId,
      })
      .then((data) => {
        const defaultToken = generateNativeTokenMetaData(chainId)
        const defaultToken2 = generateNativeTokenMetaData(chainId)
        defaultToken2.address = NATIVE_ADDRESS_0x0
        this.add([...data, defaultToken, defaultToken2])
      })
      .catch((e) => console.error("fetch tokens metadata failed", e));
  }

  add(token: TokenMetaData | TokenMetaData[]) {
    if (Array.isArray(token)) {
      token.forEach((t) => this.add(t));
    } else {
      this.tokensMap[token.address.toLowerCase()] = {  ...token, type: isNative(token.address.toLowerCase()) ? 'native' : 'erc20'  };
    }
  }

  get(address: string) {
    return this.tokensMap[address?.toLowerCase()];
  }

  getBySymbol(symbol: string) {
    return this.tokens.find((token) => token.symbol === symbol);
  }
}
export const tokensStore = new Tokens();

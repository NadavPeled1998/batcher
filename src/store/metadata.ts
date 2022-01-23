import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";
import Moralis from "moralis/types";
import { ChainID } from "../hooks/useERC20Balance";
import { isNative } from "../utils/address";
import { generateNativeTokenMetaData } from "../utils/defaults";
import { NATIVE_ADDRESS_0xE, NATIVE_ADDRESS_0x0 } from "../utils/network";
import { awesomePromise } from "../utils/promise";
import { ResNFT } from "./nfts";
import { TokensMetaDataMap, TokenMetaData } from "./tokens";
import { NFTMetaDataMap } from "./tokensRefactor";

export class Tokens {
  tokensMap: TokensMetaDataMap = {
    [NATIVE_ADDRESS_0xE]: generateNativeTokenMetaData(),
    [NATIVE_ADDRESS_0x0]: generateNativeTokenMetaData(),
  };

  get native() {
    return this.tokensMap[NATIVE_ADDRESS_0xE];
  }

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

  filterUnfetched(addresses: string[]) {
    return addresses.filter((address) => !this.tokensMap[address]);
  }

  async fetchTokensMetaData(addresses: string[], chainId: ChainID) {
    const unfetched = this.filterUnfetched(addresses);
    if (unfetched.length === 0) return console.log("all tokens are fetched");

    const [tokens, error] = await awesomePromise(
      Moralis.Web3API.token.getTokenMetadata({
        addresses: unfetched,
        chain: chainId,
      })
    );

    if (error) {
      console.error("error fetching tokens metadata:", error);
      return;
    }

    this.add(tokens!);
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
export class NFTs {
  constructor() {
    makeAutoObservable(this);
  }

  nftsMap: NFTMetaDataMap = {};

  get list() {
    return Object.values(this.nftsMap).map((nft) => Object.values(nft));
  }
  a: ResNFT
}
export class MetaData {
  constructor() {
    makeAutoObservable(this);
    // makePersistable(this, {
    //   name: "TokensStore",
    //   properties: ["tokensMap"],
    //   storage: window.localStorage,
    // });
  }
}

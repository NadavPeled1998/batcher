import { makeAutoObservable } from "mobx";
import { Moralis } from "moralis";
import { ChainID, Token } from "../hooks/useERC20Balance";
import { getTokenAddressToFetch } from "../utils/address";
import { genDefaultETHToken } from "../utils/defaults";

interface TokenPriceFetchStatus {
  succeed?: boolean;
  failed?: boolean;
  error?: any;
}

export type TokenType = "native" | "erc20" | "erc721";

export interface TokenPrice {
  fetchStatus?: TokenPriceFetchStatus;
  address: string;
  nativePrice?:
    | {
        value: string;
        decimals: number;
        name: string;
        symbol: string;
      }
    | undefined;
  usdPrice: number;
  exchangeAddress?: string | undefined;
  exchangeName?: string | undefined;
}

type PriceMap = { [key: string]: TokenPrice };

export class Prices {
  map: PriceMap = {};
  isFetching: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  get list() {
    return Object.values(this.map);
  }

  get(address: string) {
    return this.map[address];
  }

  add(tokenPrice: TokenPrice | TokenPrice[]) {
    if (Array.isArray(tokenPrice)) {
      tokenPrice.forEach((t) => {
        this.map[t.address] = t;
      });
    } else {
      this.map[tokenPrice.address] = tokenPrice;
    }
  }

  async fetch(address: string) {
    const price: TokenPrice = await Moralis.Web3API.token
      .getTokenPrice({
        address: getTokenAddressToFetch(address),
        chain: "eth",
        exchange: 'uniswap-v2'
      })
      .then(
        (price): TokenPrice => ({
          address,
          ...price,
          fetchStatus: {
            succeed: true,
          },
        })
      )
      .catch(
        (err): TokenPrice => ({
          address,
          nativePrice: undefined,
          usdPrice: 0,
          fetchStatus: {
            failed: true,
            error: err,
          },
        })
      );

    this.add(price);
    return price;
  }

  async multiFetch(tokens: Token[]) {
    this.isFetching = true;
    const promises = tokens.map((token) => this.fetch(token.token_address));
    const prices = await Promise.all(promises);
    this.add(prices);
    this.isFetching = false;
  }
}

export class Tokens {
  prices: Prices = new Prices();
  native: Token = genDefaultETHToken();
  list: Token[] = [];
  isFetching: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  set(tokens: Token[]) {
    const checkIfIsNative = (address: string) =>
      [
        "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      ].includes(address);
    this.list = [
      ...tokens.map((token: Token) => {
        return {
          ...token,
          type: checkIfIsNative(token.token_address) ? "native" : "erc20",
        };
      }),
    ];
  }

  fetch(walletAddress: string, chainId: ChainID) {
    Moralis.Web3API.account
      .getTokenBalances({ address: walletAddress, chain: chainId })
      .then((tokens) => this.set(tokens));
  }
}

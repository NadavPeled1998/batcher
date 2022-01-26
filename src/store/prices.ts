import { makeAutoObservable } from "mobx";
import { Moralis } from "moralis";
import { ChainID, Token } from "../hooks/useERC20Balance";
import { getTokenAddressToFetch, isNative } from "../utils/address";
import { CHAINS } from "../utils/chain";
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

  async fetchViaExternalAPI(tokens: Token[]) {
    const ids = tokens.map(token => {
      return `${token.name},${token.symbol}`
    }).join(',')
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`)
      const res: any = await response.json()

      const tokenPrices: TokenPrice[] = []

      tokens.map(token => {
        console.log("prices on run", res[token.name], res[token.name.toLowerCase()]?.usd, token.name, token)
        const usdPrice = +res[token.name.toLowerCase()]?.usd || +res[token.symbol.toLowerCase()]?.usd
        if (usdPrice) {
          tokenPrices.push({
            address: token.token_address,
            nativePrice: undefined,
            usdPrice,
            fetchStatus: {
              succeed: true,
            }
          })
        }
      })
      return tokenPrices
    }
    catch {
      console.log("prices fetch failed")
      return []
    }
  }
  /// i need to add here options to get the tokens rate from avalanche
  async fetch(address: string, chainId: string | null) {
    const price: TokenPrice = await Moralis.Web3API.token
      .getTokenPrice({
        address: getTokenAddressToFetch(address),
        chain: CHAINS[chainId || '0xa869'],
        // ,exchange: 'uniswap-v2'
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
          }
        })
      );

    this.add(price);
    return price;
  }

  async multiFetch(tokens: Token[], chainId: string | null) {
    this.isFetching = true;
    const promises = tokens.map((token) => this.fetch(token.token_address, chainId));
    const pricesFromMoralis = await Promise.all(promises);
    const failedTokens = tokens.filter(token => pricesFromMoralis.find(price => price.address === token.token_address)?.fetchStatus?.failed)
    const pricesFromAPI = await this.fetchViaExternalAPI(failedTokens)

    const prices = pricesFromMoralis.map(price => {
      if (price.fetchStatus?.failed) {
        const priceFromAPI = pricesFromAPI.find(priceFromAPI => priceFromAPI.address === price.address)
        if (priceFromAPI) {
          return priceFromAPI
        }
      }
      return price
    })
    this.add(prices);
    this.isFetching = false;
  }
}

export class Tokens {
  prices: Prices = new Prices();
  native: Token = genDefaultETHToken("0xa869");
  list: Token[] = [];
  isFetching: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  set(tokens: Token[]) {
    this.list = [
      ...tokens.map((token: Token) => {
        return {
          ...token,
          type: isNative(token.token_address) ? "native" : "erc20",
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

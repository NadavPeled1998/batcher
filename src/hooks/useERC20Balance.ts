import { useEffect, useState } from "react";
import {
  useMoralis,
  useMoralisWeb3Api,
  useNativeBalance,
  UseNativeBalancesParams,
  useTokenPrice,
} from "react-moralis";
import { getTokenAddressToFetch, isNative } from "../utils/address";
import { networkConfigs } from "../utils/network";

export interface Token {
  token_address: string;
  name: string;
  symbol: string;
  logo?: string | undefined;
  thumbnail?: string | undefined;
  decimals: string;
  balance: string;
}
export interface TokenPrice {
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

export type ChainID = UseNativeBalancesParams["chain"];

export const useNativeToken = () => {
  const { chainId } = useMoralis();
  const { data: nativeBalance, nativeToken } = useNativeBalance({
    chain: chainId as ChainID,
  });

  const native: Token = {
    balance: nativeBalance.balance || "0",
    decimals: String(nativeToken?.decimals || 18),
    name: nativeToken?.name || "Native",
    symbol: nativeToken?.symbol || "ETH",
    token_address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  };

  return {
    nativeToken: native,
  };
};

export const useERC20Balance = () => {
  const { account, token } = useMoralisWeb3Api();
  const { isInitialized, chainId, account: walletAddress } = useMoralis();
  const { nativeToken } = useNativeToken();

  const [tokens, setTokens] = useState<Token[]>([]);
  const [tokenPrices, setTokenPrices] = useState<TokenPrice[]>([]);
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);

  const updateTokens = (tokens: Token[]) => {
    setTokens([nativeToken, ...tokens]);
  };
  useEffect(() => {
    if (isInitialized) {
      fetchERC20Balance().then(updateTokens);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, chainId, walletAddress]);

  useEffect(() => {
    setIsLoadingPrices(true);
    Promise.all(
      tokens.map(async (tkn) => {
        const address = getTokenAddressToFetch(tkn.token_address);
        return { address, price: await token.getTokenPrice({ address, exchange: 'uniswap-v2' }) };
      })
    ).then((res) => {
      const prices = res.map(({ address, price }) => ({
        address,
        ...price,
      }));
      setTokenPrices(prices);
      setIsLoadingPrices(false);
    });
  }, [tokens, token]);

  const fetchERC20Balance = async () => {
    return await account
      .getTokenBalances({ address: walletAddress!, chain: "rinkeby" })
      .then((result) => result);
  };

  const tokensWithPrices = tokens.map((token) => {
    const address = getTokenAddressToFetch(token.token_address);
    const findTokenPrice = tokenPrices.find(
      (tokenPrice) => tokenPrice.address === address
    );
    return {
      token: token,
      price: findTokenPrice,
    };
  });

  return {
    fetchERC20Balance,
    tokens,
    tokenPrices,
    tokensWithPrices,
    isLoadingPrices,
  };
};

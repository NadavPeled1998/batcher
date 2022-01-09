import { useEffect, useState } from "react";
import { useMoralis, useMoralisWeb3Api, useNativeBalance } from "react-moralis";

export interface Token {
  token_address: string;
  name: string;
  symbol: string;
  logo?: string | undefined;
  thumbnail?: string | undefined;
  decimals: string;
  balance: string;
}

export const useNativeToken = () => {
  const { data: nativeBalance, nativeToken } = useNativeBalance();

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
  const { account } = useMoralisWeb3Api();
  const { isInitialized, chainId, account: walletAddress } = useMoralis();
  const { nativeToken } = useNativeToken();

  const [tokens, setTokens] = useState<Token[]>([]);

  const updateTokens = (tokens: Token[]) => {
    setTokens([nativeToken, ...tokens]);
  };
  useEffect(() => {
    if (isInitialized) {
      fetchERC20Balance().then(updateTokens);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, chainId, walletAddress]);

  const fetchERC20Balance = async () => {
    return await account
      .getTokenBalances({ address: walletAddress!, chain: "rinkeby" })
      .then((result) => result);
  };

  return { fetchERC20Balance, tokens };
};

import { useCallback, useEffect } from "react";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import { store } from "../store";
import { genDefaultETHToken } from "../utils/defaults";
import { ChainID } from "./useERC20Balance";

export const useAccount = () => {
  const { account, chainId } = useMoralis();
  const api = useMoralisWeb3Api();

  const fetchBalances = useCallback(() => {
    if (!account) return;

    Promise.all([
      api.account
        .getNativeBalance({
          address: account,
          chain: chainId as ChainID,
        })
        .then(({ balance }) => ({
          ...genDefaultETHToken(),
          balance,
        })),
      api.account.getTokenBalances({
        address: account,
        chain: chainId as ChainID,
      }),
    ]).then((tokens) => {
      store.tokens.set(tokens.flat());
      store.form.setToken(tokens[0]);
      store.tokens.prices.multiFetch(tokens.flat());
    });
  }, [account, chainId, api]);

  useEffect(fetchBalances, [account, fetchBalances]);
};

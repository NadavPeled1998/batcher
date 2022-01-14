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

    console.log("fetchbalance", {account, chainId})

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
      console.log("res", {tokens})
      store.tokens.set(tokens.flat());
      store.form.setToken(tokens[0]);
      store.tokens.prices.multiFetch(tokens.flat());
    })
    .catch((e) => {
      console.log("get tokens failed", { e })
    })
  }, [account, chainId, api]);

  useEffect(fetchBalances, [account, fetchBalances, chainId]);
};

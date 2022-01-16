import { useCallback, useEffect } from "react";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import { store } from "../store";
import { genDefaultETHToken } from "../utils/defaults";
import { ChainID } from "./useERC20Balance";
import multiSendAbi from "../abi/multiSend.json";
import erc20Abi from "../abi/erc20.json";
import erc721Abi from "../abi/erc721.json";
import * as abiDecoder from "abi-decoder";
abiDecoder.addABI(multiSendAbi);
abiDecoder.addABI(erc721Abi);
abiDecoder.addABI(erc721Abi);

export const useAccount = () => {
  const { account, web3, chainId } = useMoralis();
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
    ])
      .then((tokens) => {
        store.tokens.set(tokens.flat());
        store.form.setToken(tokens[0]);
        store.tokens.prices.multiFetch(tokens.flat());
      })
      .catch((e) => {
        console.log("get tokens failed", { e });
      });
  }, [account, chainId, api]);

  const fetchTransfers = useCallback(() => {
    if (!account) return;

    api.account
      .getTransactions({
        address: account,
        chain: chainId as ChainID,
      })
      .then((response) => {
        store.history.setTransactions(response);
        console.log(store.history.list)
      });
  }, [account, chainId, api]);

  useEffect(fetchBalances, [account, fetchBalances, chainId]);
  useEffect(fetchTransfers, [account, fetchTransfers, chainId]);
};

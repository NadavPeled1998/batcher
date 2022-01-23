import { useCallback, useEffect } from "react";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import { store } from "../store";
import { genDefaultETHToken } from "../utils/defaults";
import { ChainID } from "./useERC20Balance";
import multiSendAbi from "../abi/multiSend.json";
import erc20Abi from "../abi/erc20.json";
import erc721Abi from "../abi/erc721.json";
import * as abiDecoder from "abi-decoder";
import { tokensStore } from "../store/tokens";
import { ResNFT } from "../store/nfts";
import { createERC721Contract } from "../contracts";
abiDecoder.addABI(multiSendAbi);
abiDecoder.addABI(erc721Abi);
abiDecoder.addABI(erc721Abi);

export const useAccount = () => {
  const { account, web3, chainId } = useMoralis();
  const api = useMoralisWeb3Api();

  const fetchTokensMetaData = useCallback(
    async (addresses: string[]) => {
      tokensStore.fetchTokensMetaData(addresses, chainId as ChainID);
    },
    [chainId]
  );
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
        const flat = tokens.flat();
        store.tokens.set(flat);
        store.form.setToken(tokens[0]);
        store.tokens.prices.multiFetch(flat);
        fetchTokensMetaData(flat.map((t) => t.token_address));
      })
      .catch((e) => {
        console.log("get tokens failed", { e });
      });
  }, [account, chainId, api, fetchTokensMetaData]);

  const fetchERC721Balances = useCallback(() => {
    if (!account) return;

    api.account
      .getNFTs({
        address: account, // "0x299c92988198a5965111537797cc1789a5d7e336" || account,
        chain: chainId as ChainID,
      })
      .then((NFTs) => {
        // get all erc721 token addresses
        const erc721Addresses = NFTs.result?.filter((nft) => {
          if (nft.contract_type === "ERC721") return nft;
        });

        console.log("erc721Addresses:", erc721Addresses);

        store.nfts.set(NFTs.result as ResNFT[]);
      });
  }, [account, chainId, api]);

  const fetchTransfers = useCallback(() => {
    if (!account) return;

    store.history.setFetching(true);
    api.account
      .getTransactions({
        address: account,
        chain: chainId as ChainID,
      })
      .then((response) => {
        store.history.setTransactions(response);
        if (response.result?.length) {
          fetchTokensMetaData(store.history.transferredTokenAddresses);
        }
        store.history.setFetching(false);
      });
  }, [account, chainId, api, fetchTokensMetaData]);

  useEffect(fetchBalances, [account, fetchBalances, chainId]);
  useEffect(fetchTransfers, [account, fetchTransfers, chainId]);
  useEffect(fetchERC721Balances, [account, fetchTransfers, chainId]);
};

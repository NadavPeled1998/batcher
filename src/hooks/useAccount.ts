import { useCallback, useEffect } from "react";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import { store } from "../store";
import { genDefaultETHToken } from "../utils/defaults";
import { ChainID } from "../store/prices";
import multiSendAbi from "../abi/multiSend.json";
import erc721Abi from "../abi/erc721.json";
import * as abiDecoder from "abi-decoder";
import { tokensStore } from "../store/tokens";
import { ResNFT } from "../store/nfts";
import { getAssetInfo } from "../utils/assets";
import { AddressWithBalanceMap } from "../store/prices";
import { MULTI_SEND_CONTRACT_ADDRESSES } from "../utils/multiSendContractAddress";

abiDecoder.addABI(multiSendAbi);
abiDecoder.addABI(erc721Abi);
abiDecoder.addABI(erc721Abi);

export const useAccount = () => {
  const { account, web3, chainId } = useMoralis();
  const api = useMoralisWeb3Api();

  useEffect(() => {
    if (!web3 || !web3.eth || !chainId || !account || !web3.eth.currentProvider) return;

    web3.eth
      .subscribe('newBlockHeaders')
      .on('data', e => {
        if (!account) return;
        Promise.all([
          api.account
            .getNativeBalance({
              address: account,
              chain: chainId as ChainID,
            })
            .then(({ balance }) => ({
              ...genDefaultETHToken(chainId),
              balance,
            })),
          api.account.getTokenBalances({
            address: account,
            chain: chainId as ChainID,
          }),
        ])
        .then(tokens => {
          const flat = tokens.flat();
          const addressWithBalance: AddressWithBalanceMap = {}
          flat.map(token => {
            addressWithBalance[token.token_address] = token.balance
          })
          store.tokens.setBalances(addressWithBalance)
          store.form.setTokenBalance(addressWithBalance)
        })

        api.account
          .getNFTs({
            address: account,
            chain: chainId as ChainID,
          })
          .then((NFTs) => {
            // get all erc721 token addresses
            const erc721Addresses = NFTs.result?.filter((nft) => {
              if (nft.contract_type === "ERC721") return nft;
            });
            store.nfts.merge(erc721Addresses as ResNFT[]);
          });

        api.account
          .getTransactions({
            address: account,
            chain: chainId as ChainID,
          })
          .then((response) => {
            const transactions = response.result?.filter(res => res.to_address?.toLowerCase() === MULTI_SEND_CONTRACT_ADDRESSES[chainId]?.toLowerCase())
            store.history.setTransactions(transactions);
            if (response.result?.length) {
              fetchTokensMetaData(store.history.transferredTokenAddresses);
            }
            store.history.setFetching(false);
          });
      })
      .on('error', e => console.log('subscribe error', e));
    return () => {
      try {
        web3.eth.clearSubscriptions(console.log);
      } catch (e) {
        console.error(e);
      }
    };
  }, [web3, account, chainId]);

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
          ...genDefaultETHToken(chainId),
          balance,
        })),
      api.account.getTokenBalances({
        address: account,
        chain: chainId as ChainID,
      }),
    ])
      .then(async (tokens) => {
        const flat = tokens.flat();
        for (let i = 0; i < flat.length; i++) {
          try {
            const assetInfo = await getAssetInfo({ name: flat[i].name.toLowerCase() })
            flat[i].logo = assetInfo.image.large
          }
          catch {
            try {
              const assetInfo = await getAssetInfo({ name: flat[i].symbol.toLowerCase() })
              flat[i].logo = assetInfo.image.large
            }
            catch {
              console.log("failed to get assetsInfo")
            }
          }
        }
        store.tokens.set(flat);
        store.form.setToken(tokens[0]);
        store.tokens.prices.multiFetch(flat, chainId);
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
        address: account,
        chain: chainId as ChainID,
      })
      .then((NFTs) => {
        // get all erc721 token addresses
        const erc721Addresses = NFTs.result?.filter((nft) => {
          if (nft.contract_type === "ERC721") return nft;
        });

        store.nfts.set(erc721Addresses as ResNFT[]);
      });
  }, [account, chainId, api]);

  const fetchTransfers = useCallback(() => {
    if (!account || !chainId) return;

    if(!store.history.list.length) {
      store.history.setFetching(true);
    }
    api.account
      .getTransactions({
        address: account,
        chain: chainId as ChainID,
      })
      .then((response) => {
        const transactions = response.result?.filter(res => res.to_address?.toLowerCase() === MULTI_SEND_CONTRACT_ADDRESSES[chainId]?.toLowerCase())
        store.history.setTransactions(transactions);
        if (response.result?.length) {
          fetchTokensMetaData(store.history.transferredTokenAddresses);
        }
        store.history.setFetching(false);
      });
  }, [account, chainId, api, fetchTokensMetaData]);

  useEffect(() => {
    store.form.reset();
    store.batch.clear();
  }, [account, chainId]);

  useEffect(() => {
    if(chainId) {
      store.tokens.setNative(chainId);
    }
  }, [chainId])

  useEffect(fetchBalances, [account, fetchBalances, chainId]);
  useEffect(fetchTransfers, [account, fetchTransfers, chainId]);
  useEffect(fetchERC721Balances, [account, fetchTransfers, chainId]);
};

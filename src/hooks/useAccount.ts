import { useCallback, useEffect, useRef } from "react";
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
import Moralis from "moralis";
import { DEFAULT_CURRENCIES } from "../utils/defaults";

abiDecoder.addABI(multiSendAbi);
abiDecoder.addABI(erc721Abi);
abiDecoder.addABI(erc721Abi);

const generateTransactionObject = (transaction: any) => {
  return {
    hash: String(transaction.attributes.hash),
    nonce: String(transaction.attributes.nonce),
    transaction_index: String(transaction.attributes.transaction_index),
    from_address: String(transaction.attributes.from_address),
    to_address: String(transaction.attributes.to_address),
    value: String(transaction.attributes.value),
    gas: String(transaction.attributes.gas),
    gas_price: String(transaction.attributes.gas_price),
    input: String(transaction.attributes.input),
    receipt_cumulative_gas_used: String(
      transaction.attributes.receipt_cumulative_gas_used
    ),
    receipt_gas_used: String(transaction.attributes.receipt_gas_used),
    receipt_contract_address: String(
      transaction.attributes.receipt_contract_address
    ),
    receipt_root: String(transaction.attributes.receipt_root),
    receipt_status: String(transaction.attributes.receipt_status),
    block_timestamp: String(transaction.attributes.block_timestamp),
    block_number: String(transaction.attributes.block_number),
    block_hash: String(transaction.attributes.block_hash),
  };
};

export const useAccount = () => {
  const { account, web3, chainId } = useMoralis();
  const api = useMoralisWeb3Api();

  const updateBalances = () => {
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
    ]).then((tokens) => {
      const flat = tokens.flat();
      const addressWithBalance: AddressWithBalanceMap = {};
      flat.forEach((token) => {
        addressWithBalance[token.token_address] = token.balance;
      });
      store.tokens.setBalances(addressWithBalance);
      store.form.setTokenBalance(addressWithBalance);
    });

    api.account
      .getNFTs({
        address: account,
        chain: chainId as ChainID,
      })
      .then((NFTs) => {
        // get all erc721 token addresses
        const erc721Addresses = NFTs.result?.filter((nft) => nft.contract_type === "ERC721");
        store.nfts.merge(erc721Addresses as ResNFT[]);
      });
  };

  const __updateBalances = useRef(updateBalances)
  useEffect(() => {
    if (!web3 || !web3.eth || !chainId || !account || !web3.eth.currentProvider)
      return;

    if (!account || !chainId || !DEFAULT_CURRENCIES[chainId]) return;
    (Moralis as any).LiveQuery?.close();
    (async function listenToOutgoingTransactions() {
      const query = new Moralis.Query(
        `${DEFAULT_CURRENCIES[chainId]?.blockchain}Transactions`
      );
      query.equalTo("from_address", account.toLowerCase());
      const subscription = await query.subscribe();
      console.log("updateBalances socket 0")
      subscription.on("update", function (transaction) {
        if (
          transaction.attributes.to_address ===
          MULTI_SEND_CONTRACT_ADDRESSES[chainId].toLowerCase()
        ) {
          const newTransaction = generateTransactionObject(transaction);
          store.history.addTransaction(newTransaction);
        }

        const updateBalances = __updateBalances.current
        updateBalances();
      });
      subscription.on("enter", (transaction) => {
        if (
          transaction.attributes.to_address ===
          MULTI_SEND_CONTRACT_ADDRESSES[chainId].toLowerCase()
        ) {
          const newTransaction = generateTransactionObject(transaction);
          store.history.addTransaction(newTransaction);
        }
        const updateBalances = __updateBalances.current
        updateBalances();
      });
    })();
    (async function listenToIncomingTransactions() {
      const query = new Moralis.Query(
        `${DEFAULT_CURRENCIES[chainId]?.blockchain}Transactions`
      );
      query.equalTo("to_address", account.toLowerCase());
      const subscription = await query.subscribe();
      subscription.on("update", function () {
        const updateBalances = __updateBalances.current
        updateBalances();
      });
      subscription.on("enter", () => {
        const updateBalances = __updateBalances.current
        updateBalances();
      });
    })();
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
            const assetInfo = await getAssetInfo({
              name: flat[i].name.toLowerCase(),
            });
            flat[i].logo = assetInfo.image.large;
          } catch {
            try {
              const assetInfo = await getAssetInfo({
                name: flat[i].symbol.toLowerCase(),
              });
              flat[i].logo = assetInfo.image.large;
            } catch {
              console.log("failed to get assetsInfo");
            }
          }
        }
        store.tokens.set(flat);
        store.form.setToken(tokens[0]);
        store.tokens.prices.multiFetch(flat, chainId);
        fetchTokensMetaData(flat.map((t) => t.token_address));
      })
      .catch(() => {
        return;
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
        const erc721Addresses = NFTs.result?.filter((nft) => nft.contract_type === "ERC721");

        store.nfts.set(erc721Addresses as ResNFT[]);
      });
  }, [account, chainId, api]);

  const fetchTransfers = () => {
    if (!account || !chainId) return;

    if (!store.history.list.length) {
      store.history.setFetching(true);
    }
    api.account
      .getTransactions({
        address: account,
        chain: chainId as ChainID,
      })
      .then((response) => {
        const transactions = response.result?.filter(
          (res) =>
            res.to_address?.toLowerCase() ===
            MULTI_SEND_CONTRACT_ADDRESSES[chainId]?.toLowerCase()
        );
        store.history.setTransactions(transactions);
        if (response.result?.length) {
          fetchTokensMetaData(store.history.transferredTokenAddresses);
        }
        store.history.setFetching(false);
      });
  };

  useEffect(() => {
    store.form.reset();
    store.batch.clear();
  }, [account, chainId]);

  useEffect(() => {
    if (chainId) {
      store.tokens.setNative(chainId);
    }
  }, [chainId]);

  useEffect(fetchBalances, [account, fetchBalances, chainId]);
  useEffect(fetchTransfers, [account, chainId]);
  useEffect(fetchERC721Balances, [account, fetchTransfers, chainId]);
};

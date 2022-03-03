import { makeAutoObservable } from "mobx";
import Moralis from "moralis";
import { store } from ".";
import { DecodedTransfer, decodeInput } from "../abi";
import { IBatchItem, TotalsMap } from "./batch";
import { NFT } from "./nfts";
import { tokenMetaDataType, tokensStore } from "./tokens";

export interface Transaction {
  hash: string;
  nonce: string;
  transaction_index: string;
  from_address: string;
  to_address: string;
  value: string;
  gas: string;
  gas_price: string;
  input: string;
  receipt_cumulative_gas_used: string;
  receipt_gas_used: string;
  receipt_contract_address: string;
  receipt_root: string;
  receipt_status: string;
  block_timestamp: string;
  block_number: string;
  block_hash: string;
}
export interface GetTransactionsResponse {
  total?: number;
  page?: number;
  page_size?: number;
  result?: Transaction[];
}

export interface TransactionHistoryListItem {
  transaction: Transaction;
  batch: IBatchItem[];
  totals: TotalsMap;
}

const createBatchItem = (decodedTransfer: DecodedTransfer): IBatchItem => {
  if(decodedTransfer.type === tokenMetaDataType.ERC721) {
    const nft: NFT = { 
    token_address: decodedTransfer.token_address,
    address: decodedTransfer.token_address,
    id: decodedTransfer.amount,
    name: '', 
    symbol: '', 
    owner: '', 
    uri: '', 
    block_number: '', 
    amount: '', 
    type: tokenMetaDataType.ERC721,
    }

    return {
      address: decodedTransfer.receiver,
      amount: +decodedTransfer.amount,
      token: nft,
    };
  }
  else {
    const token = tokensStore.get(decodedTransfer.token_address) || {};

    return {
      address: decodedTransfer.receiver,
      amount: Moralis.Units.FromWei(
        decodedTransfer.amount,
        Number(token.decimals) || 18
      ),
      token,
    };
   }
};

export class TransactionHistory {
  transactions: Transaction[] = [];
  isFetching = false;

  constructor() {
    makeAutoObservable(this);
  }

  setFetching(isFetching: boolean) {
    this.isFetching = isFetching;
  }

  setTransactions(transactions?: Transaction[]) {
    const pendingTransactions = this.transactions.filter(
      transaction => 
        transaction.receipt_status === '' && !transactions?.find(newTransaction => newTransaction.hash === transaction.hash)
      )
    this.transactions = transactions ? [...pendingTransactions, ...transactions] : [...pendingTransactions];
  }

  addTransaction(transaction: Transaction) {
    const prevTransactionIndex =  this.transactions.findIndex(prevTransaction => prevTransaction.hash === transaction.hash)
    if(prevTransactionIndex < 0) {
      this.transactions = [transaction, ...this.transactions];
    }
    else {
      const prevTransactions = this.transactions.slice()
      prevTransactions.splice(prevTransactionIndex, 1)
      this.transactions = [transaction, ...prevTransactions]
    }
  }

  setPendingTransactionStatus({hash, receipt_status}: {hash: string, receipt_status: string}) {
    const index = this.transactions.findIndex(transaction => transaction.hash === hash)
    this.transactions[index].receipt_status = receipt_status
  }

  get list() {
    const transactionsList =  this.transactions.reduce((acc, trx) => {
      const transfers = decodeInput(trx.input);
      const transaction: { transaction: Transaction, batch: IBatchItem[], totals: TotalsMap } = {
        transaction: trx,
        batch: [], 
        totals: {}
      }
      if (transfers) {
        const batchItems = transfers.map(createBatchItem);
        const totals = store.batch.generateTotals(batchItems);
        transaction.batch = batchItems;
        transaction.totals = totals
      }

      acc.push(transaction);
      return acc;
    }, [] as TransactionHistoryListItem[]);
    return transactionsList
  }

  get transferredTokenAddresses() {
    const addresses = this.list.reduce((acc, item) => {
      item.batch.forEach((batch) => {
        if(batch.token.address) {
          acc.add(batch.token.address);
        }
      });
      return acc;
    }, new Set<string>());
    return Array.from(addresses);
  }
}

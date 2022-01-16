import { makeAutoObservable } from "mobx";
import { decodeInput, DecodedTransfer } from "../abi";
import { Batch, IBatchItem } from "./batch";
import { tokensStore } from "./tokens";
import Moralis from "moralis";

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
}

const createBatchItem = (decodedTransfer: DecodedTransfer): IBatchItem => {
  const token = tokensStore.get(decodedTransfer.token_address);
  return {
    address: decodedTransfer.receiver,
    amount: Moralis.Units.FromWei(
      decodedTransfer.amount,
      Number(token.decimals)
    ),
    token,
  };
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
  
  setTransactions(response: GetTransactionsResponse) {
    this.transactions = response.result || [];
  }

  get list() {
    return this.transactions.reduce((acc, trx) => {
      const transfers = decodeInput(trx.input);
      if (transfers) {
        acc.push({
          transaction: trx,
          batch: transfers.map(createBatchItem),
        });
      }
      return acc;
    }, [] as TransactionHistoryListItem[]);
  }

  get transferredTokenAddresses() {
    const addresses = this.list.reduce((acc, item) => {
      item.batch.forEach((batch) => {
        acc.add(batch.token.address);
      });
      return acc;
    }, new Set<string>());
    return Array.from(addresses);
  }
}

import { makeAutoObservable } from "mobx";
import Moralis from "moralis";
import { store } from ".";
import { DecodedTransfer, decodeInput } from "../abi";
import { IBatchItem, TotalsMap } from "./batch";
import { tokensStore } from "./tokens";

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
  const token = tokensStore.get(decodedTransfer.token_address) || {};
  return {
    address: decodedTransfer.receiver,
    amount: Moralis.Units.FromWei(
      decodedTransfer.amount,
      Number(token.decimals) || 18
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
        const batchItems = transfers.map(createBatchItem);
        const totals = store.batch.generateTotals(batchItems);
        acc.push({
          transaction: trx,
          batch: batchItems,
          totals,
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

import { makeAutoObservable } from "mobx";
import { decodeInput, SerializedItem } from "../abi";

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
  batch: SerializedItem[];
}

export class TransactionHistory {
  transactions: Transaction[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setTransactions(response: GetTransactionsResponse) {
    this.transactions = response.result || [];
  }

  get list() {
    return this.transactions.reduce((acc, trx) => {
      const decoded = decodeInput(trx.input);
      if (decoded) {
        acc.push({
          transaction: trx,
          batch: decoded,
        });
      }
      return acc;
    }, [] as TransactionHistoryListItem[]);
  }

}

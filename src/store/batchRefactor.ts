import { makeAutoObservable } from "mobx";
import { NFT } from "./nfts";
import { TokenMetaData } from "./tokens";

export type AssetType = "native" | "erc20" | "erc721";

export interface TransformedBatchItem {
  recipient_address: string;
  amount: number;
  token: TokenMetaData | NFT;
}

export interface BaseBatchItem {
  recipient_address: string;
  amount?: number;
  token_address: string;
  token_id?: string;
  type: AssetType;
}

export interface TotalsMap {
  [key: string]: { total: number; token?: TokenMetaData | NFT };
}

export class Batch {
  items: BaseBatchItem[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  get itemsByType() {
    return this.items.reduce((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type].push(item);
      return acc;
    }, {} as { [key: string]: BaseBatchItem[] });
  }

  async getTransformedItems() {}

  add(item: BaseBatchItem) {
    this.items.push(item);
  }

  remove(item: BaseBatchItem) {
    this.items = this.items.filter((i) => i !== item);
  }

  clear() {
    this.items = [];
  }
}
export const Batch2 = new Batch();

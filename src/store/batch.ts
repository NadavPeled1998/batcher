import { makeAutoObservable } from "mobx";
import { Token } from "../hooks/useERC20Balance";
import { NFT } from "./nfts";
import { TokenMetaData } from "./tokens";

export interface IBatchItem {
  address: string;
  amount: number;
  token: TokenMetaData | NFT;
}

type NeedsApproveMap = { [key: string]: Token | NFT };

export class Batch {
  items: IBatchItem[] = [];
  needsApproveMap: NeedsApproveMap = {};

  constructor() {
    makeAutoObservable(this);
  }

  get totals() {
    return this.items.reduce((acc, item) => {
      if (!acc[item.token.symbol]) {
        acc[item.token.symbol] = {
          total: 0,
          token: item.token,
        };
      }

      if(item.token.type === 'erc721') acc[item.token.symbol].total = 1;
      else acc[item.token.symbol].total += item.amount;
      return acc;
    }, {} as { [key: string]: { total: number; token: TokenMetaData | NFT } });
  }

  get isNeedsApprove() {
    return Boolean(Object.values(this.needsApproveMap).length);
  }

  get itemsLength() {
    return this.items.length;
  }

  add(item: IBatchItem) {
    this.items.push(item);
  }

  addToNeedsApproveMap = (token_address: string, token: Token | NFT) => {
    console.log("addToNeedsApproveMap", this);
    this.needsApproveMap = { ...this.needsApproveMap, [token_address]: token };
  };

  setNeedsApproveMap(needsApproveMap: NeedsApproveMap) {
    console.log("setNeedsApproveMap", this);
    this.needsApproveMap = needsApproveMap;
  }

  setApproveToken = (token_address: string) => {
    console.log("setApproveToken", this);
    const needsApprove = this.needsApproveMap;
    delete needsApprove[token_address];
    this.needsApproveMap = needsApprove;
  };

  remove(item: IBatchItem) {
    this.items = this.items.filter((i) => i !== item);
    if (!this.items.find((el) => el.token.address === item.token.address)) {
      this.setApproveToken(item.token.address);
    }
  }

  clear() {
    this.items = [];
    this.needsApproveMap = {};
  }
}

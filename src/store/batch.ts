import { makeAutoObservable } from "mobx";
import { Token } from "../hooks/useERC20Balance";

export interface IBatchItem {
  address: string;
  amount: number;
  token: Token;
}

type NeedsApproveMap = { [key: string]: Token };

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

      acc[item.token.symbol].total += item.amount;
      return acc;
    }, {} as { [key: string]: { total: number; token: Token } });
  }

  get isNeedsApprove() {
    return Boolean(Object.values(this.needsApproveMap).length)
  }

  add(item: IBatchItem) {
    console.log("add",this, { item: this?.items})
    this.items.push(item);
  }

  addToNeedsApproveMap = (token_address: string, token: Token) => {
    console.log("addToNeedsApproveMap", this)
    this.needsApproveMap = {...this.needsApproveMap, [token_address]: token}
  }
  
  
  setNeedsApproveMap(needsApproveMap: NeedsApproveMap) {
    console.log("setNeedsApproveMap", this)
    this.needsApproveMap = needsApproveMap
  }

  setApproveToken = (token_address: string) => {
    console.log("setApproveToken", this)
    const needsApprove = this.needsApproveMap
    delete needsApprove[token_address]
    this.needsApproveMap = needsApprove
  } 

  remove(item: IBatchItem) {
    this.items = this.items.filter((i) => i !== item);
    if(!(this.items.find(el => el.token.token_address === item.token.token_address))){
      this.setApproveToken(item.token.token_address)
    }
  }

  clear() {
    this.items = [];
    this.needsApproveMap = {}
  }
}

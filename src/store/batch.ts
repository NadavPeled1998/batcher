import { makeAutoObservable } from "mobx";
import { Token } from "../hooks/useERC20Balance";

export interface IBatchItem {
  address: string;
  amount: number;
  token: Token;
}

export class Batch {
  items: IBatchItem[] = [];

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

  add(item: IBatchItem) {
    this.items.push(item);
  }

  remove(item: IBatchItem) {
    this.items = this.items.filter((i) => i !== item);
  }

  clear() {
    this.items = [];
  }
}

import { makeAutoObservable } from "mobx";
import { InputType } from "../components/TokenAmountInput";
import { Token } from "../hooks/useERC20Balance";

export interface IBatchItem {
  address: string;
  amount: number;
  token: Token;
}

class Batch {
  items: IBatchItem[] = [];

  constructor() {
    makeAutoObservable(this);
  }
  get totals() {
    return this.items.reduce((acc, item) => {
      if (!acc[item.token.symbol]) acc[item.token.symbol] = 0;
      acc[item.token.symbol] += item.amount;

      return acc;
    }, {} as { [key: string]: number });
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
class SendFrom {
  amountInputType: InputType = InputType.Fiat;
  selectedToken: Token = {
    token_address: "",
    name: "",
    symbol: "",
    logo: undefined,
    thumbnail: undefined,
    decimals: "",
    balance: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  setAmountInputType(type: InputType) {
    this.amountInputType = type;
  }
}
class Store {
  batch: Batch = new Batch();
  sendFrom: SendFrom = new SendFrom();
}

export const store = new Store();

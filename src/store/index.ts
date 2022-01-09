import { makeAutoObservable } from "mobx";

export interface IBatchItem {
  address: string;
  amount: number;
  token: string;
}

class Batch {
  uiInputs = {
    address: "",
    amount: 0,
    token: "",
  };
  
  batchItems: IBatchItem[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addItem(item: IBatchItem) {
    this.batchItems.push(item);
  }
}

export const store = new Batch();

import { makeAutoObservable } from "mobx";
import { InputType } from "../components/TokenAmountInput";
import { Token } from "../hooks/useERC20Balance";
import { genDefaultETHToken } from "../utils/defaults";
import { Tokens } from "./prices";

export class Form {
  amountInputType: InputType = InputType.Token;
  selectedToken: Token = genDefaultETHToken();

  address = {
    value: "",
  };

  tokenPicker = {
    value: genDefaultETHToken(),
  };

  amount = {
    type: InputType.Token,
    value: "",
  };

  constructor(public tokenStore: Tokens) {
    makeAutoObservable(this);
    this.tokenPicker.value = this.tokenStore.list[0] || genDefaultETHToken();
  }

  setAddress(address: string) {
    this.address.value = address;
  }

  setToken(token: Token) {
    this.tokenPicker.value = token;
  }

  setAmount(amount: string) {
    this.amount.value = amount;
  }

  setAmountInputType(type: InputType) {
    this.amountInputType = type;
  }

  clear() {
    this.address.value = "";
    this.tokenPicker.value = this.tokenStore.list[0] || genDefaultETHToken();
    this.amount.value = "";
  }
}

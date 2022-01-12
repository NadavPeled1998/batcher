import { makeAutoObservable } from "mobx";
import { InputType } from "../components/TokenAmountInput";
import { Token } from "../hooks/useERC20Balance";
import { isValidAddress } from "../utils/address";
import { genDefaultETHToken } from "../utils/defaults";
import { Tokens } from "./prices";
import * as yup from "yup";
import { Batch } from "./batch";

const schema = yup
  .object({
    address: yup
      .string()
      .test("is-valid-address", "Invalid address", isValidAddress),
    amount: yup.number().required().positive(),
  })
  .required();
export class Form {
  amountInputType: InputType = InputType.Token;

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

  constructor(public tokenStore: Tokens, public batchStore: Batch) {
    makeAutoObservable(this);
    this.tokenPicker.value = this.tokenStore.list[0] || genDefaultETHToken();
  }

  get selectedTokenUSDPrice() {
    const tokenPrice = this.tokenStore.prices.get(
      this.tokenPicker.value.token_address
    );
    return tokenPrice?.usdPrice || 0;
  }

  get canInputFiat() {
    return this.selectedTokenUSDPrice > 0;
  }

  setAddress(address: string) {
    this.address.value = address;
  }

  setToken(token: Token) {
    this.tokenPicker.value = token;
    if (!this.canInputFiat) {
      this.amount.type = InputType.Token;
    }
    console.log();
  }

  setAmount(amount: string) {
    this.amount.value = amount;
  }

  setAmountInputType(type: InputType) {
    this.amount.type = type;
  }

  async submit() {
    this.batchStore.add({
      address: this.address.value,
      amount: Number(this.amount.value),
      token: this.tokenPicker.value,
    });
    this.clear();
  }

  clear() {
    this.address.value = "";
    this.amount.value = "";
  }
}

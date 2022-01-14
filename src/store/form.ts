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
  constructor(public tokenStore: Tokens, public batchStore: Batch) {
    makeAutoObservable(this);
    this.tokenPicker = this.tokenStore.list[0] || genDefaultETHToken();
  }

  tokenPicker: Token;
  address = "";

  amountInputType: InputType = InputType.Token;
  usd: number = 0;
  _amount: number = 0;

  get amount() {
    if (this.amountInputType === InputType.Token) {
      return this._amount;
    } else {
      return this.usd;
    }
  }

  set amount(value) {
    if (this.amountInputType === InputType.Token) {
      this._amount = value;
      this.usd = value * this.selectedTokenUSDPrice;
    } else {
      this.usd = value;
      this._amount = value / this.selectedTokenUSDPrice;
    }
  }

  get selectedTokenUSDPrice() {
    return 3158.5 ;
    const tokenPrice = this.tokenStore.prices.get(
      this.tokenPicker.token_address
    );
    return tokenPrice?.usdPrice || 0;
  }

  get canInputFiat() {
    return this.selectedTokenUSDPrice > 0;
  }

  setAddress(address: string) {
    this.address = address;
  }

  setToken(token: Token) {
    this.tokenPicker = token;
    if (!this.canInputFiat) {
      this.amountInputType = InputType.Token;
    }
  }

  setAmount(amount: string) {
    const val = Number(amount);
    if ([this._amount, this.usd].includes(val)) return;
    this.amount = val;
  }

  setAmountInputType(type: InputType) {
    this.amountInputType = type;
  }

  reset() {
    this.clear();
    this.amountInputType = InputType.Token;
    this.tokenPicker = genDefaultETHToken();
  }

  clear() {
    this.address = "";
    this.amount = 0;
  }

  async submit() {
    this.batchStore.add({
      address: this.address,
      amount: Number(this.amount),
      token: this.tokenPicker,
    });
    this.clear();
  }
}

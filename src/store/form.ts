import { makeAutoObservable } from "mobx";
import Moralis from "moralis";
import { InputType } from "../components/TokenAmountInput";
import { Token } from "../hooks/useERC20Balance";
import { genDefaultETHToken } from "../utils/defaults";
import { Batch } from "./batch";
import { NFT } from "./nfts";
import { Tokens } from "./prices";
import { tokensStore } from "./tokens";

export enum AssetType {
  Token,
  NFT,
}
export class Form {
  constructor(public tokenStore: Tokens, public batchStore: Batch) {
    makeAutoObservable(this);
    this.selectedToken = this.tokenStore.list[0] || genDefaultETHToken();
  }

  selectedToken: Token;
  selectedNFTs?: NFT[];
  address = "";

  assetType: AssetType = AssetType.Token;
  amountInputType: InputType = InputType.Token;
  usd: number = 0;
  _amount: number = 0.0;

  checkAddress(web3: Moralis.Web3, address: string) {
    return web3.eth.getBalance(address);
  }

  get amount() {
    if (this.amountInputType === InputType.Token) {
      return this._amount;
    } else {
      return this.usd;
    }
  }

  set amount(value) {
    if (this.amountInputType === InputType.Token) {
      this.updateAmount(value);
    } else {
      this.updateUSD(value);
    }
  }

  updateAmount(amount: number) {
    this._amount = amount;
    this.usd = amount * this.selectedTokenUSDPrice;
  }

  updateUSD(usd: number) {
    this.usd = usd;
    this._amount = usd / this.selectedTokenUSDPrice;
  }

  get selectedTokenUSDPrice() {
    const tokenPrice = this.tokenStore.prices.get(
      this.selectedToken.token_address
    );
    return tokenPrice?.usdPrice || 0;
  }

  get canInputFiat() {
    return this.selectedTokenUSDPrice > 0;
  }

  setAddress(address: string) {
    this.address = address;
  }

  setAssetType(assetType: AssetType) {
    this.assetType = assetType;
  }

  setToken(token: Token) {
    this.selectedToken = token;
    if (!this.canInputFiat) {
      this.amountInputType = InputType.Token;
    }
  }

  setNFTs(nfts: NFT[]) {
    this.selectedNFTs = nfts;
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
    this.selectedToken = this.tokenStore.list[0] || genDefaultETHToken();
  }

  clear() {
    // this.address = "";
    // this.amount = 0;
    this.selectedNFTs = [];
  }

  async submit() {
    const token =
      this.assetType === AssetType.Token
        ? tokensStore.get(this.selectedToken.token_address)
        : this.selectedNFTs;
    if (token) {
      if (Array.isArray(token)) {
        token.forEach(async (t) => {
          this.batchStore.add({
            address: this.address,
            amount: Number(this._amount),
            token: t,
          });
        });
      } else {
        this.batchStore.add({
          address: this.address,
          amount: Number(this._amount),
          token: token,
        });
      }
    }
    this.clear();
  }
}

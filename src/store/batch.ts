import { makeAutoObservable } from "mobx";
import Moralis from "moralis";
import { createMultiSendContract } from "../contracts";
import { MultiSend } from "../abi/types/MultiSend";
import { Token } from "../hooks/useERC20Balance";
import { NFT } from "./nfts";
import { TokenMetaData } from "./tokens";
import Web3 from "web3";

export interface IBatchItem {
  address: string;
  amount: number;
  token: TokenMetaData | NFT;
}
export interface TotalsMap {
  [key: string]: { total: number; token?: TokenMetaData | NFT };
}

type NeedsApproveMap = { [key: string]: Token | NFT };

export class Batch {
  items: IBatchItem[] = [];
  needsApproveMap: NeedsApproveMap = {};

  constructor() {
    makeAutoObservable(this);
  }

  get totals() {
    return this.generateTotals(this.items);
  }

  generateTotals(items: IBatchItem[]) {
    return items.reduce((acc, item) => {
      if (item.token.type === "erc721") {
        if (!acc.nft) acc.nft = { total: 0 };
        acc.nft.total += 1;
      } else {
        if (!acc[item.token.symbol]) {
          acc[item.token.symbol] = {
            total: 0,
            token: item.token,
          };
        }
        acc[item.token.symbol].total += item.amount
      }

      return acc;
    }, {} as TotalsMap);
  }

  // async estimateGas(web: Moralis.Web3, walletAddress: string) {
  //   const MSContract = createMultiSendContract(web);

  //   const [receivers, amounts, tokens] = this.items.reduce(
  //     (acc, item) => {
  //       acc[0].push(item.address);
  //       acc[1].push(Web3.utils.toWei(item.amount.toString()));
  //       acc[2].push(item.token.address);
  //       return acc;
  //     },
  //     [[], [], [], []] as string[][]
  //   );

  //   MSContract.methods
  //     .multiSendERC20(receivers, amounts, tokens)
  //     .estimateGas({
  //       from: walletAddress,
  //     })
  //     .then((gas) => console.log("gas", gas))
  //     .catch((e) => console.log("gas", e));
  // }

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
    this.needsApproveMap = { ...this.needsApproveMap, [token_address]: token };
  };

  setNeedsApproveMap(needsApproveMap: NeedsApproveMap) {
    this.needsApproveMap = needsApproveMap;
  }

  setApproveToken = (token_address: string) => {
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

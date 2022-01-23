import { makeAutoObservable } from "mobx";
import Moralis from "moralis";
import {
  createERC20Contract,
  createERC721Contract,
  createMultiSendContract,
  MULTI_SEND_CONTRACT_ADDRESS,
} from "../contracts";
import { MultiSend } from "../abi/types/MultiSend";
import { Token } from "../hooks/useERC20Balance";
import { NFT, nftsStore } from "./nfts";
import { TokenMetaData, Tokens, tokensStore } from "./tokens";
import Web3 from "web3";
import { TokenType } from "./prices";
import { etherToWei } from "../utils/ethereum";

export type AssetType = "native" | "erc20" | "erc721";

export interface TransformedBatchItem {
  recipient_address: string;
  amount: number;
  token: TokenMetaData | NFT;
}

export interface BaseBatchItem {
  recipient_address: string;
  amount?: number;
  token_address: string;
  token_id?: string;
  type: AssetType;
}

export interface TotalsMap {
  [key: string]: { total: number; token?: TokenMetaData | NFT };
}

export class Batch {
  items: BaseBatchItem[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  get itemsByType() {
    return this.items.reduce((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type].push(item);
      return acc;
    }, {} as { [key: string]: BaseBatchItem[] });
  }

  async getTransformedItems() {}

  add(item: BaseBatchItem) {
    this.items.push(item);
  }

  remove(item: BaseBatchItem) {
    this.items = this.items.filter((i) => i !== item);
  }

  clear() {
    this.items = [];
  }
}
export const Batch2 = new Batch();

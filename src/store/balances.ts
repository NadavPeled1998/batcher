import { makeAutoObservable } from "mobx";
import { NATIVE_ADDRESS_0x0, NATIVE_ADDRESS_0xE } from "../utils/network";
import { TokensMetaDataMap } from "./tokens";

type BalancesMap = { [token_address: string]: string };
type NFTSMap = { [nft_address: string]: Set<string> };

type AddNFTParams = {
  token_address: string;
  token_id: string;
};

type NFT = {
  token_address: string;
  token_id: string;
  contract_type: string;
  owner_of?: string;
  block_number?: string;
  block_number_minted?: string;
  token_uri?: string;
  metadata?: string;
  synced_at?: string;
  amount?: string;
  name: string;
  symbol: string;
};

export class Assets {
  constructor() {
    makeAutoObservable(this);
  }

  balancesMap: BalancesMap = {
    [NATIVE_ADDRESS_0x0]: "0",
    [NATIVE_ADDRESS_0xE]: "0",
  };

  setNativeBalance(balance: string) {
    this.balancesMap[NATIVE_ADDRESS_0x0] = balance;
    this.balancesMap[NATIVE_ADDRESS_0xE] = balance;
  }

  setERC20Balance(tokens: { token_address: string; balance: string }[]) {
    tokens.forEach((token) => {
      this.balancesMap[token.token_address] = token.balance;
    });
  }

  nftsMap: NFTSMap = {};
  detailedNFTs: NFT[] = [];

  setNFTs(nfts: NFT[]) {
    this.nftsMap = {};
    this.detailedNFTs = nfts;
    nfts.forEach((nft) => {
      if (!this.nftsMap[nft.token_address]) {
        this.nftsMap[nft.token_address] = new Set();
      }
      this.nftsMap[nft.token_address].add(nft.token_id);
    });
  }

  tokensMetaData: TokensMetaDataMap = {
    
  }
}

export const assets = new Assets();
//@ts-ignore
window.assets = assets;

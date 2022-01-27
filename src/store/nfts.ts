import { makeAutoObservable } from "mobx";
import Moralis from "moralis";
import { ChainID } from "../hooks/useERC20Balance";
import { getImage } from "../utils/nft";

export interface NFT {
  token_address: string;
  address: string;
  id: string;
  name: string;
  symbol: string;
  owner: string;
  uri?: string;
  block_number: string; //same
  amount?: string;
  type: "erc721";
  iconUrl?: string;
}

export interface ResNFT {
  token_address: string;
  token_id: string;
  contract_type: string;
  owner_of: string;
  block_number: string;
  block_number_minted: string;
  token_uri?: string;
  metadata?: string;
  synced_at?: string;
  amount?: string;
  name: string;
  symbol: string;
}

export class NFTs {
  list: NFT[] = [];
  isFetching: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  set(nfts: ResNFT[]) {
    const list = nfts
      .filter((nft) => nft.contract_type === "ERC721")
      .map((nft, index) => {
        return {
          token_address: nft.token_address,
          address: nft.token_address,
          id: nft.token_id,
          name: nft.name,
          symbol: nft.symbol,
          owner: nft.owner_of,
          uri: nft.token_uri,
          block_number: nft.block_number,
          amount: nft.amount,
          type: "erc721",
        };
      }) as NFT[];
    this.list = list;
    list.map((nft) => {
      getImage(nft.uri).then((iconUrl) =>
        this.setIconUrl(nft.address, nft.id, iconUrl)
      );
    });
  }

  get(token_address: string, token_id: string) {
    return this.list.find(
      (nft) => nft.token_address === token_address && nft.id === token_id
    );
  }
  // get(nftId: string) {
  //   return this.list.find((nft) => nft.id === nftId);
  // }
  merge(nfts: ResNFT[]) {
    const newNfts = nfts.filter(
      (nft) =>
        !this.list.find(
          (it) =>
            it.token_address === nft.token_address && nft.token_id === it.id
        )
    );
    newNfts.map((nft) => {
      this.list.push({
        token_address: nft.token_address,
        address: nft.token_address,
        id: nft.token_id,
        name: nft.name,
        symbol: nft.symbol,
        owner: nft.owner_of,
        uri: nft.token_uri,
        block_number: nft.block_number,
        amount: nft.amount,
        type: "erc721",
      });
      getImage(nft.token_uri).then((iconUrl) =>
        this.setIconUrl(nft.token_address, nft.token_id, iconUrl)
      );
    });
    const oldNftsIndexes: number[] = [];
    this.list.map((it, index) => {
      if (
        !nfts.find(
          (nft) =>
            it.token_address === nft.token_address && nft.token_id === it.id
        )
      ) {
        oldNftsIndexes.push(index);
      }
    });
    if (oldNftsIndexes.length) {
      const list: any = this.list.slice();
      oldNftsIndexes.map((index) => {
        list[index] = undefined;
      });
      this.list = list.filter((it: any) => it);
    }
  }

  setIconUrl(address: string, id: string, iconUrl: string) {
    const index = this.list.findIndex(
      (nft) => nft.id === id && nft.address === address
    );
    this.list[index].iconUrl = iconUrl;
  }

  fetch(walletAddress: string, chainId: ChainID) {
    Moralis.Web3API.account
      .getNFTs({ address: walletAddress, chain: chainId })
      .then((nfts) => this.set(nfts.result as ResNFT[]));
  }
}

export const nftsStore = new NFTs();

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
        // this.setIconUrls(index)
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
        // this.setIconUrls(index)
      }) as NFT[];
    this.list = list;
    list.map((nft) => {
      getImage(nft.uri).then((iconUrl) =>
        this.setIconUrl(nft.address, nft.id, iconUrl)
      );
    });
  }

  get(nftId: string) {
    return this.list.find((nft) => nft.id === nftId);
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

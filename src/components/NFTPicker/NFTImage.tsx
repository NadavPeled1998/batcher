import { FC } from "react";
import { Token } from "../../hooks/useERC20Balance";
import { NFT } from "../../store/nfts";
import { TokenMetaData } from "../../store/tokens";
import { DEFAULT_IMAGE } from "../../utils/nft";
interface NFTImageProps {
  nft?: NFT;
  size?: string;
}

export const NFTImage: FC<NFTImageProps> = ({ nft, size = "40" }) => {
  return  <img src={nft?.iconUrl || DEFAULT_IMAGE} width={size} height={size} className="p-2" alt="token icon url" />
};

import { Flex, Image, ImageProps, Spinner } from "@chakra-ui/react";
import { FC, useState } from "react";
import { NFT } from "../../store/nfts";
import { DEFAULT_IMAGE } from "../../utils/nft";
import fallBackImg from "../../assets/image.svg";
interface NFTImageProps extends ImageProps {
  nft?: NFT;
}

export const NFTImage: FC<NFTImageProps> = ({
  nft,
  boxSize = "40px",
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <>
      <Image
        position={isLoading ? "absolute" : undefined}
        opacity={isLoading ? 0 : 1}
        borderRadius="4px"
        boxSize={boxSize}
        src={ nft?.iconUrl || fallBackImg}
        alt="NFT image"
        onLoad={() => setIsLoading(false)}
        {...props}
      />
      <Flex
        alignItems="center"
        justifyContent="center"
        hidden={!isLoading}
        boxSize={boxSize}
        w={props.w}
        h={props.h}
        borderRadius="4px"
      >
        <Spinner speed="1s" />
      </Flex>
    </>
  );
};

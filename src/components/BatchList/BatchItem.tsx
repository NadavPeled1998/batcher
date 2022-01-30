import { Badge, CloseButton, Flex, Text } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { ChevronRight, Send } from "react-feather";
import Moralis from "moralis";
import { useMoralis } from "react-moralis";
import { store } from "../../store";
import { IBatchItem } from "../../store/batch";
import { NFT } from "../../store/nfts";
import { TokenMetaData } from "../../store/tokens";
import { shortenAddress } from "../../utils/address";
import { formatNumber } from "../../utils/currency";
import { NFTImage } from "../NFTPicker/NFTImage";
import { TokenIcon } from "../TokenPicker/TokenIcon";
import { ChainID } from "../../store/prices";
import { getImage } from "../../utils/nft";

export interface BatchItemProps {
  item: IBatchItem;
  readonly?: boolean;
}

export const BatchItem: FC<BatchItemProps> = ({ item, readonly }) => {
  const { chainId } = useMoralis();
  const [iconUrl, setIconUrl] = useState<string>('')
  
  useEffect(() => {
    if(item.token.type === 'erc721') {
      const token = item.token as NFT
      if(!token.uri) {
        const options = { address: token.token_address, token_id: token.id, chain: chainId as ChainID };
        Moralis.Web3API.token.getTokenIdMetadata(options)
          .then(metadata => {
            if(metadata.token_uri) {
              getImage(metadata.token_uri)
                .then((iconUrl) => {
                  setIconUrl(iconUrl)
                })
            }
        })
      }
      else {
        if(token.iconUrl) {
          setIconUrl(token.iconUrl)
        }
      }
    }
  }, [item.token.type])

  return (
    <Flex fontSize="sm" alignItems="center" gap={2} w="full" flex={1} minH="8">
      <Send size="1em" color="var(--chakra-colors-primary-200)" />
      {item.token.type === "erc721" ? (
        <>
          <Badge colorScheme="teal">NFT</Badge>
          <NFTImage boxSize="5" nft={{...item.token as NFT, iconUrl: (item.token as NFT).iconUrl || iconUrl}} />
        </>
      ) : (
        <>
          <Text>
            {formatNumber(item.amount, 6)}{" "}
            <Text d="inline" fontSize="xs">
              {item.token.symbol}
            </Text>
          </Text>
          <TokenIcon token={item.token as TokenMetaData} size="16" />
        </>
      )}
      <ChevronRight
        size="0.8em"
        strokeWidth={4}
        color="var(--chakra-colors-primary-200)"
      />
      <Text>{shortenAddress(item.address)}</Text>
      <CloseButton
        hidden={readonly}
        rounded="full"
        ml="auto"
        color="primary.200"
        onClick={() => store.batch.remove(item)}
      />
    </Flex>
  );
};

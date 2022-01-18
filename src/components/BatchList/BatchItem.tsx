import { CloseButton, Flex, Text } from "@chakra-ui/react";
import { FC } from "react";
import { ChevronRight, Send } from "react-feather";
import { store } from "../../store";
import { IBatchItem } from "../../store/batch";
import { NFT } from "../../store/nfts";
import { TokenMetaData } from "../../store/tokens";
import { shortenAddress } from "../../utils/address";
import { formatNumber } from "../../utils/currency";
import { NFTImage } from "../NFTPicker/NFTImage";
import { TokenIcon } from "../TokenPicker/TokenIcon";

export interface BatchItemProps {
  item: IBatchItem;
  readonly?: boolean;
}

export const BatchItem: FC<BatchItemProps> = ({ item, readonly }) => {
  return (
    <Flex fontSize="sm" alignItems="center" gap={2}>
      <Send size="1em" color="var(--chakra-colors-primary-200)" />
      {item.token.type === 'erc721' ? (
        <NFTImage nft={item.token as NFT} />
      ) : (
          <>
            <Text>

              {formatNumber(item.amount, 6)} {item.token.symbol}
            </Text>
            <TokenIcon token={item.token as TokenMetaData} size="20" />
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

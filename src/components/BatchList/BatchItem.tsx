import { CloseButton, Flex, Text } from "@chakra-ui/react";
import { FC } from "react";
import { ChevronRight, Send } from "react-feather";
import { store } from "../../store";
import { IBatchItem } from "../../store/batch";
import { shortenAddress } from "../../utils/address";
import { formatNumber } from "../../utils/currency";
import { TokenIcon } from "../TokenPicker/TokenIcon";

export interface BatchItemProps {
  item: IBatchItem;
  readonly?: boolean;
}

export const BatchItem: FC<BatchItemProps> = ({ item, readonly }) => {
  return (
    <Flex fontSize="sm" alignItems="center" gap={2} w="full" flex={1}>
      <Send size="1em" color="var(--chakra-colors-primary-200)" />
      <Text>
        {formatNumber(item.amount, 6)} <Text d="inline" fontSize="xs">{item.token.symbol}</Text>
      </Text>
      <TokenIcon token={item.token} size="16 " />
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

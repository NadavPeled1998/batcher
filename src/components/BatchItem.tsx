import { CloseButton, Flex, FlexProps, Text } from "@chakra-ui/react";
import { FC } from "react";
import { ChevronRight, Send } from "react-feather";
import { IBatchItem } from "../components/BatchList";
import { shortenAddress } from "../utils/address";

export interface BatchItemProps {
  item?: IBatchItem;
}

export const BatchItem: FC<BatchItemProps> = ({ item }) => {
  return (
    <Flex fontSize="md" alignItems="center" gap={2}>
      <Send size="1em" color="var(--chakra-colors-primary-200)" />
      <Text>1.5 ETH</Text>
      <ChevronRight
        size="0.8em"
        strokeWidth={4}
        color="var(--chakra-colors-primary-200)"
      />
      <Text>{shortenAddress("0x48v7a98df87bas87d9b87a9s8d7f")}</Text>
      <CloseButton ml="auto" color="primary.200" />
    </Flex>
  );
};

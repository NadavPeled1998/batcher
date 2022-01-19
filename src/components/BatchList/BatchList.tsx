import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { FC, useRef } from "react";
import { Token } from "../../hooks/useERC20Balance";
import { store } from "../../store";
import { NFT } from "../../store/nfts";
import { ClearBatchButton } from "../Dialogs/ClearBatchButton";
import { BatchItem } from "./BatchItem";

export interface IBatchItem {
  address: string;
  amount: number;
  token: Token | NFT;
}

export const BatchList: FC = observer(() => {
  const listRef = useRef<HTMLDivElement>(null);
  if (!store.batch.items.length) return null;
  listRef.current?.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <Flex direction="column" gap={2} flex={1}>
      <Flex alignItems="center" justifyContent="space-between">
        <Text fontSize="sm" color="gray.400">
          Batch{" "}
          <Text fontSize="xs" d="inline">
            ({store.batch.items.length})
          </Text>
        </Text>
        <ClearBatchButton />
      </Flex>
      <Divider borderColor="gray.700" />
      <Flex direction="column" flex={1}>
        <Box
          ref={listRef}
          h="full"
          maxH={["160px", "220px"]}
          overflowY="scroll"
        >
          {store.batch.items
            .slice()
            .map((item, index) => (
              <Flex alignItems="center" w="full">
                <Text fontSize="xs">{index + 1}.</Text>
                <BatchItem key={index} item={item} />
              </Flex>
            ))
            .reverse()}
        </Box>
      </Flex>
    </Flex>
  );
});

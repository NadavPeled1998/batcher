import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { Token } from "../../hooks/useERC20Balance";
import { store } from "../../store";
import { ClearBatchButton } from "../Dialogs/ClearBatchButton";
import { BatchItem } from "./BatchItem";

export interface IBatchItem {
  address: string;
  amount: number;
  token: Token;
}

export const BatchList: FC = observer(() => {
  if (!store.batch.items.length) return null;

  return (
    <Box experimental_spaceY={2}>
      <Flex alignItems="center" justifyContent="space-between">
        <Text fontSize="sm" color="gray.400">
          Batch{" "}
          <Text fontSize="xs" d="inline">
            ({store.batch.items.length})
          </Text>
        </Text>
        <ClearBatchButton />
      </Flex>
      <Divider />
      <Flex direction="column" maxH="200px" overflowY="auto">
        {store.batch.items
          .slice()
          .reverse()
          .map((item, index) => (
            <BatchItem key={index} item={item} />
          ))}
      </Flex>
    </Box>
  );
});

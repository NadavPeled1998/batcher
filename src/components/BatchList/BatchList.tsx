import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { FC, useRef } from "react";
import { CSVDownload, CSVLink } from "react-csv";
import { Token } from "../../hooks/useERC20Balance";
import { store } from "../../store";
import { IBatchItem } from "../../store/batch";
import { NFT } from "../../store/nfts";
import { TokenMetaData } from "../../store/tokens";
import { convertBatchToCSV } from "../../utils/csv";
import { ClearBatchButton } from "../Dialogs/ClearBatchButton";
import { BatchItem } from "./BatchItem";

// export interface IBatchItem {
//   address: string;
//   amount: number;
//   token: TokenMetaData | NFT;
// }
export interface BatchListProps {
  batch?: IBatchItem[];
  readonly?: boolean;
}

export const BatchList: FC<BatchListProps> = observer(({ batch, readonly }) => {
  const items = batch || store.batch.items;
  const listRef = useRef<HTMLDivElement>(null);
  if (!items.length) return null;
  listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  const csvData = convertBatchToCSV(items);

  return (
    <Flex direction="column" gap={2} flex={1}>
      <Flex alignItems="center" justifyContent="space-between">
        <Text fontSize="sm" color="gray.400">
          Batch{" "}
          <Text fontSize="xs" d="inline">
            ({items.length})
          </Text>
        </Text>
        <ClearBatchButton hidden={readonly} />
      </Flex>
      <Divider borderColor="gray.700" />
      <Flex direction="column" flex={1}>
        <Box
          ref={listRef}
          h="full"
          maxH={["160px", "220px"]}
          overflowY="auto"
        >
          {items
            .slice()
            .map((item, index) => (
              <Flex alignItems="center" w="full" key={index}>
                <Text fontSize="xs">{index + 1}.</Text>
                <BatchItem key={index} item={item} readonly={readonly} />
              </Flex>
            ))
            .reverse()}
        </Box>
        {/* <Box hidden={readonly}>
          <CSVLink data={csvData} filename="batch.csv">
            Download me
          </CSVLink>
        </Box> */}
      </Flex>
    </Flex>
  );
});

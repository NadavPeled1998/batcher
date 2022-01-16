import { Badge, Box, Divider, Flex, Spinner, Text } from "@chakra-ui/react";
import { FC, useState } from "react";
import { Collapse } from "react-collapse";
import { Check, ChevronDown, Layers } from "react-feather";
import { BatchItem } from "../../../components/BatchList/BatchItem";
import { TransactionHistoryListItem } from "../../../store/history";
import { shortenAddress } from "../../../utils/address";
import { formatNumber } from "../../../utils/currency";
interface Props {
  item: TransactionHistoryListItem;
}
export const HistoryListItem: FC<Props> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  return (
    <>
      <Flex
        py={2}
        px={4}
        direction="column"
        fontSize="sm"
        w="full"
        _hover={{ bg: "gray.700" }}
        onClick={toggle}
      >
        <Flex
          alignItems="center"
          gap={4}
          w="full"
          justifyContent="space-between"
        >
          <Box>
            <Text fontSize="xs" color="gray.500">
              Batched Transactions
            </Text>
            <Flex fontSize="lg" gap={2} alignItems="center">
              <Layers color="var(--chakra-colors-primary-200)" size="1.2em" />
              <Text>{formatNumber(item.batch.length)}</Text>
              {/* <Flex ml={[0, 2]} fontSize="xs" gap={2} alignItems="center">
                <Spinner size="sm" speed="1s" />
                <Text>Pending</Text>
              </Flex> */}
              <Flex ml={[0, 2]} fontSize="xs" gap={2} alignItems="center">
                <Check size="1.2em" color="var(--chakra-colors-green-500)" />
                <Text>Sent</Text>
              </Flex>
            </Flex>
          </Box>
          <Box ml="auto" textAlign="right">
            <Text fontSize="xs" color="gray.500">
              Date
            </Text>
            <Text>
              {new Date(item.transaction.block_timestamp).toLocaleString()}
            </Text>
          </Box>
          <Box textAlign="right" transition="transform 200ms" rotate="">
            <ChevronDown />
          </Box>
        </Flex>
      </Flex>

      <Collapse isOpened={isOpen} >
        <Flex w="full" fontSize="sm" direction="column" px={4} pb={2} gap={2}>
          {item.batch.map((batch, i) => (
            <BatchItem key={i} item={batch} readonly />
          ))}
        </Flex>
      </Collapse>
    </>
  );
};

import { Badge, Box, Divider, Flex, Spinner, Text } from "@chakra-ui/react";
import { FC, useState } from "react";
import { Collapse } from "react-collapse";
import { ChevronDown, Layers } from "react-feather";
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
              <Flex ml={[0, 2]} fontSize="xs" gap={2} alignItems="center">
                <Spinner size="sm" speed="1s" />
                <Text>Pending</Text>
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

      <Collapse isOpened={isOpen}>
        {item.batch.map((batch) => (
          <Flex fontSize="sm" gap={2} py={2} px={4} alignItems="center">
            <Text>{shortenAddress(batch.address)}</Text>
            <Text>{batch.amount}</Text>
            <Badge colorScheme="primary">{batch.token.type}</Badge>
          </Flex>
        ))}
      </Collapse>
    </>
  );
};

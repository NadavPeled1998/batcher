import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { FC, useState } from "react";
import { Collapse } from "react-collapse";
import { Check, ChevronDown, ExternalLink, Layers } from "react-feather";
import { useMoralis } from "react-moralis";
import { BatchItem } from "../../../components/BatchList/BatchItem";
import { ChainID } from "../../../hooks/useERC20Balance";
import { TransactionHistoryListItem } from "../../../store/history";
import { shortenAddress } from "../../../utils/address";
import { formatNumber } from "../../../utils/currency";
import { getExplorer } from "../../../utils/network";
interface Props {
  item: TransactionHistoryListItem;
}

export const HistoryListItem: FC<Props> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const { chainId } = useMoralis();

  const openExplorer = () => {
    const href = `${getExplorer(chainId as ChainID)}tx/${
      item.transaction.hash
    }`;
    window.open(href, "_blank");
  };

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

      <Collapse isOpened={isOpen}>
        <Flex
          direction={["column", "column", "row"]}
          w="full"
          gap={[4, 8]}
          px={4}
          pb={4}
        >
          <Flex direction="column" gap={2} w="full" fontSize="sm" flex="1">
            <Text fontSize="xs">Transaction info</Text>
            <Flex alignItems="center" gap={2}>
              <Text fontWeight={600} fontSize="xs" color="gray.500">
                Transaction Hash:
              </Text>
              <Button
                ml="auto"
                fontWeight="normal"
                variant="link"
                size="sm"
                colorScheme="primary"
                onClick={openExplorer}
                rightIcon={<ExternalLink size="1em" />}
              >
                {shortenAddress(item.transaction.hash)}
              </Button>
            </Flex>
            <Flex>
              <Text fontWeight={600} fontSize="xs" color="gray.500">
                Block number:
              </Text>
              <Text ml="auto">{item.transaction.block_number}</Text>
            </Flex>
            <Flex>
              <Text fontWeight={600} fontSize="xs" color="gray.500">
                Gas used:
              </Text>
              <Text ml="auto">{item.transaction.receipt_gas_used}</Text>
            </Flex>
          </Flex>
          <Box
            width={["full", "full", "1px"]}
            borderRightWidth={[0, 0, 1]}
            // borderBottomWidth={[1, 1, 0]}
          ></Box>
          <Flex direction="column" gap={2} w="full" fontSize="sm" flex="1">
            <Text fontSize="xs">Batch list</Text>
            <Flex
              fontSize="sm"
              direction="column"
              gap={2}
              maxH="200px"
              overflow="auto"
            >
              {item.batch.map((batch, i) => (
                <BatchItem key={i} item={batch} readonly />
              ))}
            </Flex>
          </Flex>
        </Flex>
      </Collapse>
    </>
  );
};

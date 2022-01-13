import {
  Badge,
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Send } from "react-feather";
import { TokenIcon } from "../components/TokenPicker/TokenIcon";
import { shortenAddress } from "../utils/address";

export const History = () => {
  return (
    <Flex
      direction="column"
      bg="gray.900"
      w="1024px"
      mx="auto"
      p="8"
      gap="8"
      overflow="auto"
      //   rounded="40px"
    >
      <Heading>Here will be a filter, I promise</Heading>

      <Table size="sm" whiteSpace="nowrap" overflow="auto">
        <Thead>
          <Tr>
            <Th>Action</Th>
            <Th>To/From</Th>
            <Th>Date</Th>
            <Th>Token</Th>
            <Th isNumeric>Amount</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>
              <Flex gap={2} alignItems="center">
                <Send size="1em" color="var(--chakra-colors-primary-200)" />{" "}
                <Text>Send</Text>
              </Flex>
            </Td>
            <Td>
              {shortenAddress("0x15E7e507172ffe9EC1bEEC7b11C3a1Cff1521407")}
            </Td>
            <Td>{new Date().toDateString()}</Td>
            <Td>
              <Badge fontWeight="300" colorScheme="primary">
                NFT{" "}
                <Text fontSize="9px" d="inline">
                  ERC721
                </Text>
              </Badge>
            </Td>
            <Td isNumeric></Td>
          </Tr>
          <Tr>
            <Td>
              <Flex gap={2} alignItems="center">
                <Send size="1em" color="var(--chakra-colors-primary-200)" />{" "}
                <Text>Send</Text>
              </Flex>
            </Td>
            <Td>
              {shortenAddress("0x15E7e507172ffe9EC1bEEC7b11C3a1Cff1521407")}
            </Td>
            <Td>{new Date().toDateString()}</Td>
            <Td>
              <Badge fontWeight="300" colorScheme="green">
                Token{" "}
                <Text fontSize="9px" d="inline">
                  ERC20
                </Text>
              </Badge>
            </Td>
            <Td>
              <Flex justifyContent="flex-end" gap={2}>
                <TokenIcon token="BNB" size="15" />
                <Text>30.48 BNB</Text>
              </Flex>
            </Td>
          </Tr>
          <Tr>
            <Td>
              <Flex gap={2} alignItems="center">
                <Send size="1em" color="var(--chakra-colors-primary-200)" />{" "}
                <Text>Send</Text>
              </Flex>
            </Td>
            <Td>
              {shortenAddress("0x15E7e507172ffe9EC1bEEC7b11C3a1Cff1521407")}
            </Td>
            <Td>{new Date().toDateString()}</Td>
            <Td>
              <Badge fontWeight="300" colorScheme="green">
                Token{" "}
                <Text fontSize="9px" d="inline">
                  ERC20
                </Text>
              </Badge>
            </Td>
            <Td>
              <Flex justifyContent="flex-end" gap={2}>
                <TokenIcon token="UNI" size="15" />
                <Text>30.48 UNI</Text>
              </Flex>
            </Td>
          </Tr>
          <Tr>
            <Td>
              <Flex gap={2} alignItems="center">
                <Send size="1em" color="var(--chakra-colors-primary-200)" />{" "}
                <Text>Send</Text>
              </Flex>
            </Td>
            <Td>
              {shortenAddress("0x15E7e507172ffe9EC1bEEC7b11C3a1Cff1521407")}
            </Td>
            <Td>{new Date().toDateString()}</Td>
            <Td>
              <Badge fontWeight="300" colorScheme="green">
                Token{" "}
                <Text fontSize="9px" d="inline">
                  ERC20
                </Text>
              </Badge>
            </Td>
            <Td>
              <Flex justifyContent="flex-end" gap={2}>
                <TokenIcon token="LINK" size="15" />
                <Text>30.48 LINK</Text>
              </Flex>
            </Td>
          </Tr>
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>Action</Th>
            <Th>To/From</Th>
            <Th>Date</Th>
            <Th>Token</Th>
            <Th isNumeric>Amount</Th>
          </Tr>
        </Tfoot>
      </Table>
    </Flex>
  );
};

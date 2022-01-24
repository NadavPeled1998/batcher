import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Flex,
  Box,
  useDisclosure,
  Collapse,
  Text,
  HStack,
  Stack,
} from "@chakra-ui/react";
import { ChevronDown } from "react-feather";
import { shortenAddress } from "../../utils/address";

export const CSVExample = () => {
  const { isOpen, onToggle } = useDisclosure();
  return (
    <>
      <Box w="full" bg="gray.900" p={4} px={4} rounded="lg">
        <Flex alignItems="center" onClick={onToggle} cursor="pointer">
          <Box flex="1">
            <Text fontSize="xl" fontWeight={500}>
              How should it look?
            </Text>
          </Box>
          <Box
            ml="auto"
            transition="all 0.2s"
            transform={isOpen ? "rotate(180deg)" : ""}
            as={ChevronDown}
            rotate="12deg"
          />
        </Flex>
        <Collapse in={isOpen} animateOpacity>
          <Box
            overflowX="auto"
            mt={isOpen ? 4 : 0}
            transition="margin 0.2s"
            rounded="xl"
            borderColor="gray.700"
          >
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Recipient Address</Th>
                  <Th>Amount</Th>
                  <Th>Token Address</Th>
                  <Th>Token ID</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>
                    <Flex fontSize="xs" color="primary.200">
                      Native token example
                    </Flex>
                    {shortenAddress(
                      "0xAf4364fC3605B2a6c188ca94775d8E2B6F34C405"
                    )}
                  </Td>
                  <Td>1.5</Td>
                  <Td></Td>
                  <Td></Td>
                </Tr>
                <Tr>
                  <Td>
                    <Flex fontSize="xs" color="green.300">
                      ERC20 token example
                    </Flex>
                    {shortenAddress(
                      "0xAf4364fC3605B2a6c188ca94775d8E2B6F34C405"
                    )}
                  </Td>
                  <Td>121</Td>
                  <Td>
                    {" "}
                    {shortenAddress(
                      "0x3605B2a6Af4364fC3605B2a6c188ca94775d8E2B6F34C405188ca94"
                    )}
                  </Td>
                  <Td></Td>
                </Tr>
                <Tr>
                  <Td>
                    <Flex fontSize="xs" color="purple.300">
                      ERC721 (NFT) example
                    </Flex>
                    {shortenAddress(
                      "0xAf4364fC3605B2a6c188ca94775d8E2B6F34C405"
                    )}
                  </Td>
                  <Td></Td>
                  <Td>
                    {shortenAddress(
                      "0x3605B2a6Af4364fC3605B2a6c188ca94775d8E2B6F34C405188ca94"
                    )}
                  </Td>
                  <Td>
                    {shortenAddress(
                      "0x3605B2a6Af4364fC3605B2a6c188ca94775d8E2B6F34C405188ca94"
                    )}{" "}
                    (ID)
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
        </Collapse>
      </Box>
    </>
  );
};

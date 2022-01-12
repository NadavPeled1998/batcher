import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement, Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { Moralis } from "moralis";
import { FC } from "react";
import { Search } from "react-feather";
import { Token } from "../../hooks/useERC20Balance";
import { store } from "../../store";
import { TokenIcon } from "./TokenIcon";

interface TokenPickerModalProps extends ReturnType<typeof useDisclosure> {
  onSelect: (token: Token) => void;
}
export const TokenPickerModal: FC<TokenPickerModalProps> = observer(
  ({ onSelect, isOpen, onClose }) => {
    const handleSelect = (token: Token) => {
      onSelect(token);
      onClose?.();
    };
    const {
      list: tokens,
      prices: { isFetching },
    } = store.tokens;

    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
        <ModalOverlay />
        <ModalContent bg="gray.800" rounded={24} mx={4}>
          <ModalHeader>Select token</ModalHeader>
          <ModalCloseButton rounded="full" />
          <ModalBody>
            <Flex direction="column" gap={3}>
              <InputGroup size="lg" mb={6}>
                <InputLeftElement children={<Search />} />
                <Input rounded="full" />
              </InputGroup>
              {isFetching ? (
                <Spinner mx="auto" my={4} />
              ) : (
                tokens.map((token, index) => (
                  <Flex
                    key={index}
                    onClick={() => handleSelect(token)}
                    gap={2}
                    alignItems="center"
                    rounded="full"
                    p={1}
                    pr={4}
                    transition="all 0.2s"
                    _hover={{ bg: "gray.700" }}
                  >
                    <TokenIcon token={token} />
                    <Flex direction="column" alignItems="flex-start">
                      <Text fontSize="md" fontWeight={500}>
                        {token.symbol}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {token.name}
                      </Text>
                    </Flex>
                    <Text ml="auto" textAlign="right" fontWeight={500}>
                      {parseFloat(
                        Moralis.Units.FromWei(
                          token.balance,
                          Number(token.decimals)
                        ).toFixed(6)
                      )}
                      <Text fontSize="xs">
                        {store.tokens.prices
                          .get(token.token_address)
                          ?.usdPrice.toFixed(2) || 1}
                      </Text>
                    </Text>
                  </Flex>
                ))
              )}
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button size="sm" variant="ghost" mx="auto" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
);

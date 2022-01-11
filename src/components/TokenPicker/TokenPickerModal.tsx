import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { Search } from "react-feather";
import { useMoralis } from "react-moralis";
import { useList } from "react-use";
import { Token, useERC20Balance } from "../../hooks/useERC20Balance";
import { TokenIcon } from "./TokenIcon";

interface TokenPickerModalProps extends ReturnType<typeof useDisclosure> {
  onSelect: (token: Token) => void;
}
export const TokenPickerModal: FC<TokenPickerModalProps> = ({
  onSelect,
  isOpen,
  onClose,
}) => {
  const handleSelect = (token: Token) => {
    onSelect(token);
    onClose?.();
  };
  const { Moralis } = useMoralis();
  const { tokens: assets, tokensWithPrices } = useERC20Balance();
  const [list, { filter, set, reset }] = useList(assets);

  useEffect(() => {
    set(assets);
  }, [set, assets]);

  const filterTokens = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const value = ev.target.value;
    reset();
    if (!value) return;

    const reg = new RegExp(value, "i");
    filter((token) => {
      if (!value) return true;
      return reg.test(token.symbol) || reg.test(token.name);
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
      <ModalOverlay />
      <ModalContent bg="gray.800" rounded={24} mx={4}>
        <ModalHeader>Select token</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column" gap={3}>
            <InputGroup size="lg" mb={6}>
              <InputLeftElement children={<Search />} />
              <Input rounded="full" onInput={filterTokens} />
            </InputGroup>
            {tokensWithPrices.map(({ token, price }, index) => (
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
                  <Text fontSize="xs">{price?.usdPrice.toFixed(2) || 1}</Text>
                </Text>
              </Flex>
            ))}
            {list.length === 0 && (
              <object
                data={require("../../assets/unicorn.svg").default}
                type="image/svg+xml"
              >
                <img src="yourfallback.jpg" />
              </object>
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
};

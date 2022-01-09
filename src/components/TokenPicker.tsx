import { Box, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { ChevronDown } from "react-feather";
import { Token, useNativeToken } from "../hooks/useERC20Balance";
import { TokenIcon } from "./TokenPicker/TokenIcon";
import { TokenPickerModal } from "./TokenPicker/TokenPickerModal";

export const TokenPicker = () => {
  const modalController = useDisclosure();
  const { nativeToken } = useNativeToken();
  const [token, setToken] = useState<Token>(nativeToken);

  const handleTokenSelect = (token: Token) => {
    setToken(token);
  };
  
  return (
    <>
      <TokenPickerModal onSelect={handleTokenSelect} {...modalController} />
      <Flex
        cursor="pointer"
        alignItems="center"
        gap={2}
        onClick={modalController.onOpen}
        rounded="full"
        pr={2}
        py={1}
        pl={1}
        bg="gray.700"
        transition="all 0.2s"
        _hover={{
          bg: "gray.600",
        }}
      >
        <TokenIcon token={token} />
        <Text>{token.symbol}</Text>
        <Box boxSize="24px" d="flex" alignItems="center">
          <ChevronDown color="white" size="1em" strokeWidth={4} />
        </Box>
      </Flex>
    </>
  );
};

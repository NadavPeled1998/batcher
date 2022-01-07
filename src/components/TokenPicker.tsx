import {
  Box,
  Button,
  Flex,
  HStack,
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
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search } from "react-feather";
import { TokenPickerModal } from "./TokenPicker/TokenPickerModal";

export const TokenPicker = () => {
  const modalController = useDisclosure();
  const [token, setToken] = useState("ETH");

  const handleTokenSelect = (token: string) => {
    setToken(token);
    console.log(token);
  };
  return (
    <>
      <TokenPickerModal onSelect={handleTokenSelect} {...modalController} />
      <Flex
        flex={1}
        cursor="pointer"
        alignItems="center"
        gap={2}
        onClick={modalController.onOpen}
        rounded="full"
        pt={1}
        pl={1}
        pb={1}
        bg="gray.700"
        transition="all 0.2s"
        _hover={{
          bg: "gray.600",
        }}
      >
        <img
          src={
            require(`cryptocurrency-icons/svg/color/${token.toLowerCase()}.svg`)
              .default
          }
          width="30"
          height={30}
          alt="eth"
        />
        <span>{token}</span>
        <Box boxSize="24px" d="flex" alignItems="center">
          <ChevronDown color="white" size="1em" strokeWidth={4} />
        </Box>
      </Flex>
    </>
  );
};

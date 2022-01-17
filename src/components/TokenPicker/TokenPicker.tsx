import {
  Box,
  Flex,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { ChevronDown } from "react-feather";
import { useMoralis } from "react-moralis";
import { Token } from "../../hooks/useERC20Balance";
import { store } from "../../store";
import { TokenIcon } from "./TokenIcon";
import { TokenPickerModal } from "./TokenPickerModal";

export interface TokenPickerProps {
  onChange?: (token: Token) => void;
  value: Token;
}
export const TokenPicker: FC<TokenPickerProps> = observer(
  ({ onChange, value }) => {
    const { isAuthenticated } = useMoralis();
    const modalController = useDisclosure();
    const toast = useToast();
    const { prices } = store.tokens;

    const handleTokenSelect = (token: Token) => {
      onChange?.(token);
    };

    const openModal = () => {
      if (!isAuthenticated) {
        return toast({
          title: "Please connect your wallet first.",
          status: "info",
          variant:'subtle',
          isClosable: true,
          containerStyle: {
            borderRadius: "0.5rem",
            padding: "1.5rem",
          },
        });
      }

      modalController.onOpen();
    };

    return (
      <>
        <TokenPickerModal onSelect={handleTokenSelect} {...modalController} />

        <Box position="relative">
          <Box
            hidden={!prices.isFetching}
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
          >
            <Spinner />
          </Box>
          <Flex
            opacity={prices.isFetching ? 0 : 1}
            cursor="pointer"
            alignItems="center"
            gap={2}
            onClick={openModal}
            rounded="full"
            pr={2}
            py={1}
            pl={1}
            borderColor="gray.700"
            transition="all 0.2s"
            _hover={{
              bg: "gray.600",
            }}
          >
            <TokenIcon token={value} />
            <Text>{value.symbol}</Text>
            <Box boxSize="24px" d="flex" alignItems="center">
              <ChevronDown color="white" size="1em" strokeWidth={4} />
            </Box>
          </Flex>
        </Box>
      </>
    );
  }
);

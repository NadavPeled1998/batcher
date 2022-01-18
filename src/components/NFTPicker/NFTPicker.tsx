import { Box, Flex, Spinner, Text, useDisclosure } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { ChevronDown } from "react-feather";
import { store } from "../../store";
import { NFTImage } from "./NFTImage";
import { TokenPickerModal } from "./NFTPickerModal";
import { NFT } from "../../store/nfts";

export interface NFTPickerProps {
  onChange?: (token: NFT) => void;
  value?: NFT;
}
export const NFTPicker: FC<NFTPickerProps> = observer(
  ({ onChange, value }) => {
    const modalController = useDisclosure();
    const { prices } = store.tokens;

    const handleTokenSelect = (token: NFT) => {
      onChange?.(token);
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
            onClick={modalController.onOpen}
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
            <NFTImage nft={value} />
            <Text>{value?.symbol}</Text>
            <Box boxSize="24px" d="flex" alignItems="center">
              <ChevronDown color="white" size="1em" strokeWidth={4} />
            </Box>
          </Flex>
        </Box>
      </>
    );
  }
);

import {
  Box,
  BoxProps,
  Button,
  CloseButton,
  Divider,
  Flex,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { FC, useState } from "react";
import { PlusCircle, X } from "react-feather";
import { store } from "../../store";
import { NFT } from "../../store/nfts";
import { NFTImage } from "./NFTImage";
import { TokenPickerModal } from "./NFTPickerModal";

export interface NFTPickerProps extends Omit<BoxProps, "onChange"> {
  onChange?: (nfts: NFT[]) => void;
  value?: NFT[];
}

export const NFTPicker: FC<NFTPickerProps> = observer(
  ({ onChange, value: selectedNFTs = [], ...props }) => {
    const modalController = useDisclosure();
    const { prices } = store.tokens;

    const removeNFT = (nft: NFT) => {
      onChange?.(selectedNFTs.filter((n) => nft.id !== n.id));
    };

    const clearNFTs = () => {
      onChange?.([]);
    };

    return (
      <>
        <TokenPickerModal
          selectedNFTs={selectedNFTs}
          onSelect={(nfts) => onChange?.(nfts)}
          {...modalController}
        />

        <Box position="relative" w="full" {...props}>
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
            direction="column"
            opacity={prices.isFetching ? 0 : 1}
            alignItems="center"
            gap={2}
            w="full"
            rounded="full"
          >
            {selectedNFTs.length ? (
              <>
                <Flex
                  w="full"
                  bg="gray.800"
                  px={3}
                  py={1}
                  rounded="full"
                  alignItems="center"
                  mb={2}
                >
                  <Text fontSize="sm" color="gray.400">
                    Selected NFTs ({selectedNFTs.length})
                  </Text>
                  <Button
                    size="xs"
                    colorScheme="primary"
                    variant="ghost"
                    rounded="full"
                    ml="auto"
                    leftIcon={<X size="1.2em" />}
                    onClick={clearNFTs}
                  >
                    Clear all
                  </Button>
                </Flex>
                <Flex flexWrap="wrap" gap={2} justifyContent="center">
                  {selectedNFTs.map((nft, index) => (
                    <Box position="relative">
                      <Box
                        rounded="full"
                        position="absolute"
                        bg="gray.800"
                        top="0"
                        right="0"
                        transform="translate(30%, -30%)"
                        borderWidth={1}
                        boxShadow="dark-lg"
                        borderColor="gray.600"
                        size="xs"
                        p="3px"
                        children={<X size="14" />}
                        zIndex={10}
                        // pointerEvents="none"
                        cursor="pointer"
                        onClick={() => removeNFT(nft)}
                      />
                      <NFTImage
                        key={index}
                        nft={nft}
                        boxSize="60px"
                        rounded="lg"
                        boxShadow="dark-lg"
                      />
                    </Box>
                  ))}
                </Flex>
                <Button
                  variant="ghost"
                  leftIcon={<PlusCircle />}
                  mt="4"
                  rounded="full"
                  onClick={modalController.onOpen}
                >
                  Add More
                </Button>
              </>
            ) : (
              <>
                <Box
                  variant="ghost"
                  onClick={modalController.onOpen}
                  d="flex"
                  rounded="3xl"
                  alignItems="center"
                  flexDirection="column"
                  transition="all 0.2s"
                  cursor="pointer"
                  gap={2}
                  borderWidth="1px"
                  borderStyle="dashed"
                  borderColor="gray.700"
                  p={4}
                  py={5}
                  _hover={{
                    bg: "gray.700",
                  }}
                >
                  <PlusCircle
                    size={40}
                    strokeWidth={1}
                    color="var(--chakra-colors-primary-200)"
                  />
                  <Text>Select NFT</Text>
                </Box>
              </>
            )}
          </Flex>
        </Box>
      </>
    );
  }
);

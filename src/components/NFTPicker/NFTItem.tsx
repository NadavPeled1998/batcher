import { Flex, FlexProps, ImageProps, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { Check } from "react-feather";
import { NFT } from "../../store/nfts";
import { NFTImage } from "./NFTImage";

interface NFTItemProps extends Omit<FlexProps, "onSelect"> {
  nft: NFT;
  selected?: boolean;
  onSelect?: (nft: NFT) => void;
  imageProps?: ImageProps;
}
export const NFTItem: FC<NFTItemProps> = observer(
  ({ nft, onSelect, selected, imageProps, ...props }) => {
    return (
      <Flex
        position="relative"
        direction="column"
        gap={2}
        p={2}
        overflow="hidden"
        alignItems="center"
        cursor="pointer"
        rounded={["30px"]}
        bg="gray.800"
        transition="all 0.2s"
        // borderWidth={selected ? "2px" : "1px"}
        borderWidth="2px"
        borderColor={selected ? "primary.200" : "gray.700"}
        boxShadow="0px 0px 10px rgba(0, 0, 0, 0.4)"
        _hover={{
          borderColor: selected ? "" : "gray.600",
          boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.8)",
        }}
        onClick={() => {
          onSelect?.(nft);
        }}
        {...props}
      >
        <NFTImage
          nft={nft}
          boxSize=""
          w="full"
          h="120px"
          objectFit="cover"
          //   bg="gray.900"
          rounded={["25px"]}
          {...imageProps}
        />
        {selected && (
          <Flex
            position="absolute"
            w="full"
            h="full"
            top="0"
            left="0"
            alignItems="center"
            justifyContent="center"
            backdropBlur="md"
            bg="rgba(0,0,0,0.7)"
          >
            <Flex
              rounded="full"
              alignItems="center"
              justifyContent="center"
              boxShadow="dark-lg"
              bg="rgba(0,0,0,0.7)"
              p={4}
            >
              <Check
                size="45px"
                strokeWidth={4}
                // color="var(--chakra-colors-primary-200)"
                color="white"
              />
            </Flex>
          </Flex>
        )}
        <Flex
          direction="column"
          alignItems="flex-start"
          maxW="full"
          overflowX="hidden"
          w="full"
          p={2}
          px={4}
          whiteSpace="nowrap"
        >
          <Text
            fontSize="md"
            maxW="full"
            textOverflow="ellipsis"
            overflow="hidden"
            fontWeight={500}
          >
            {nft.symbol}
          </Text>
          <Flex w="full" maxW="full" gap={1}>
            <Text
              textOverflow="ellipsis"
              overflow="hidden"
              fontSize="xs"
              flex="1"
              color="gray.500"
            >
              {nft.name}
            </Text>
            <Text
              textOverflow="ellipsis"
              overflow="hidden"
              fontSize="xs"
              color="gray.500"
            >
              #{nft.id}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    );
  }
);

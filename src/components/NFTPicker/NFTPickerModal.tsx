import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
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
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { Moralis } from "moralis";
import { FC, useEffect, useState } from "react";
import { Search } from "react-feather";
import { useMap } from "react-use";
import { Token } from "../../hooks/useERC20Balance";
import { store } from "../../store";
import { NFT } from "../../store/nfts";
import { NFTList } from "../NFTList/NFTList";
import { NFTImage } from "./NFTImage";
import { NFTItem } from "./NFTItem";
import sadHorsePNG from "../../assets/dragon2.png";

interface NFTListItem {
  isSelected?: boolean;
  nft: NFT;
}
interface TokenPickerModalProps extends ReturnType<typeof useDisclosure> {
  onSelect: (nft: NFT[]) => void;
  selectedNFTs: NFT[];
}
type SelectedMap = { [key: string]: NFT };

const nftKey = (nft: NFT) => `${nft.token_address}-${nft.id}`;
const createSelectedMap = (selectedNFTs: NFT[]) =>
  selectedNFTs.reduce(
    (acc, nft) => ({
      ...acc,
      [nftKey(nft)]: nft,
    }),
    {} as SelectedMap
  );

export const TokenPickerModal: FC<TokenPickerModalProps> = observer(
  ({ selectedNFTs = [], onSelect, isOpen, onClose }) => {
    const {
      prices: { isFetching },
    } = store.tokens;

    const [search, setSearch] = useState("");

    const [selectedMap, { set, remove, setAll }] = useMap<SelectedMap>(
      createSelectedMap(selectedNFTs)
    );

    const reset = () => setAll(createSelectedMap(selectedNFTs));
    useEffect(reset, [selectedNFTs.length, setAll]);
    const { list: nfts } = store.nfts;
    // get 20 random indexed nfts
    // const nfts = store.nfts.list.slice(0, 20);
    const filteredNfts = !search
      ? nfts
      : nfts.filter((nft) => {
          const reg = new RegExp(search, "i");
          return (
            nft.name.match(reg) ||
            nft.symbol.match(reg) ||
            nft.id.match(reg) ||
            nft.token_address.match(reg)
          );
        });

    const hasNFTs = filteredNfts.length > 0;

    const handleSelect = (nft: NFT) => {
      const key = nftKey(nft);
      if (selectedMap[key]) {
        remove(key);
      } else {
        set(key, nft);
      }
    };

    const cancel = () => {
      onClose();
      reset();
    };

    const nftList = filteredNfts.map((nft) => ({
      isSelected: !!selectedMap[nftKey(nft)],
      nft,
    }));

    const submitSelected = () => {
      onSelect(Object.values(selectedMap));
      onClose();
    };

    return (
      <Modal
        isOpen={isOpen}
        onClose={cancel}
        isCentered
        size="full"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent bg="gray.800" h="full" rounded="0">
          <ModalHeader>Select NFT</ModalHeader>
          <ModalCloseButton rounded="full" />
          <ModalBody p={[1, 2, 6]}>
            <Flex direction="column" h="full">
              <InputGroup
                size="lg"
                mb={6}
                maxW="xl"
                mx="auto"
                hidden={!hasNFTs}
              >
                <InputLeftElement children={<Search />} />
                <Input
                  rounded="full"
                  value={search}
                  placeholder="Search NFT"
                  onInput={(ev) => setSearch(ev.currentTarget.value)}
                />
              </InputGroup>
              <Flex
                // bg="gray.900"
                gap={3}
                p={[1, 4]}
                maxH="full"
                h="full"
                alignItems="flex-start"
                flexWrap="wrap"
                justifyContent="center"
                overflowY="auto"
              >
                {
                  isFetching ? (
                    <Spinner mx="auto" my={4} />
                  ) : hasNFTs ? (
                    nftList
                      .filter(
                        ({ nft }) =>
                          !store.batch.items.find(
                            (item) =>
                              item.token.address.toLowerCase() ===
                                nft.address?.toLowerCase() &&
                              (item.token as NFT).id === nft.id
                          )
                      )
                      .map(({ isSelected, nft }, index) => (
                        <NFTItem
                          selected={isSelected}
                          key={index}
                          w={["45%", "45%", "240px"]}
                          imageProps={{ h: ["140px", "240px", "240px"] }}
                          nft={nft}
                          onSelect={handleSelect}
                        />
                      ))
                  ) : (
                    <Stack alignItems="center" my="auto">
                      <Image src={sadHorsePNG} w="200px" maxW="full" />
                      <Text fontSize="lg">You don't have any NFTs yet.</Text>
                    </Stack>
                  )
                  // <NFTList
                  //   items={nftList}
                  //   renderer={({ key, style, item: { isSelected, nft } }) => (
                  //     <NFTItem
                  //     m={2}
                  //       key={key}
                  //       style={style}
                  //       nft={nft}
                  //       selected={isSelected}
                  //       onSelect={handleSelect}
                  //     />
                  //   )}
                  // />
                }
              </Flex>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              size="sm"
              color="gray.400"
              variant="ghost"
              mx="auto"
              onClick={cancel}
            >
              Cancel
            </Button>
            <Button
              hidden={!hasNFTs}
              rounded="full"
              colorScheme="primary"
              mx="auto"
              px="10"
              fontWeight="bold"
              onClick={submitSelected}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
);

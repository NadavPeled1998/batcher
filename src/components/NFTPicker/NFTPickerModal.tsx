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
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { Moralis } from "moralis";
import { FC, useEffect } from "react";
import { Search } from "react-feather";
import { useMap } from "react-use";
import { Token } from "../../hooks/useERC20Balance";
import { store } from "../../store";
import { NFT } from "../../store/nfts";
import { NFTImage } from "./NFTImage";
import { NFTItem } from "./NFTItem";

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

    const [selectedMap, { set, remove, setAll }] = useMap<SelectedMap>(
      createSelectedMap(selectedNFTs)
    );

    const reset = () => setAll(createSelectedMap(selectedNFTs));
    useEffect(reset, [selectedNFTs.length, setAll]);
    const { list: nfts } = store.nfts;

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

    const nftList = nfts.map((nft) => ({
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
              <InputGroup size="lg" mb={6} maxW="xl" mx="auto">
                <InputLeftElement children={<Search />} />
                <Input rounded="full" placeholder="Search NFT" />
              </InputGroup>
              <Flex
                // bg="gray.900"
                gap={3}
                p={[1, 4]}
                maxH="full"
                flexWrap="wrap"
                justifyContent="center"
                overflowY="auto"
              >
                {isFetching ? (
                  <Spinner mx="auto" my={4} />
                ) : (
                  nftList.map(({ isSelected, nft }, index) => (
                    <NFTItem
                      selected={isSelected}
                      key={index}
                      w={["45%", "45%", "300px"]}
                      imageProps={{ h: ["140px", "240px", "300px"] }}
                      nft={nft}
                      onSelect={handleSelect}
                    />
                  ))
                )}
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

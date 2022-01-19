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
import { FC } from "react";
import { Search } from "react-feather";
import { useMap } from "react-use";
import { Token } from "../../hooks/useERC20Balance";
import { store } from "../../store";
import { NFT } from "../../store/nfts";
import { NFTImage } from "./NFTImage";
import { NFTItem } from "./NFTItem";

interface TokenPickerModalProps extends ReturnType<typeof useDisclosure> {
  onSelect: (token: NFT) => void;
}
export const TokenPickerModal: FC<TokenPickerModalProps> = observer(
  ({ onSelect, isOpen, onClose }) => {
    const [selectedMap, { set, remove }] = useMap<{ [key: string]: NFT }>({});
    const handleSelect = (nft: NFT) => {
      // onSelect(token);
      // onClose?.();
      if (selectedMap[nft.id]) {
        remove(nft.id);
      } else {
        set(nft.id, nft);
      }
    };
    const {
      list: tokens,
      prices: { isFetching },
    } = store.tokens;
    const { list: nfts } = store.nfts;

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
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
                  nfts.map((nft, index) => (
                    <NFTItem
                      selected={!!selectedMap[nft.id]}
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
            <Button size="sm" color="gray.400" variant="ghost" mx="auto" onClick={onClose}>
              Close
            </Button>
            <Text
              rounded="full"
              colorScheme="primary"
              mx="auto"
              fontWeight="bold"
              onClick={onClose}
            >
              Ok
            </Text>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
);

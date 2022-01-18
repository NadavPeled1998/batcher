import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement, Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { Moralis } from "moralis";
import { FC } from "react";
import { Search } from "react-feather";
import { Token } from "../../hooks/useERC20Balance";
import { store } from "../../store";
import { NFT } from "../../store/nfts";
import { NFTImage } from "./NFTImage";

interface TokenPickerModalProps extends ReturnType<typeof useDisclosure> {
  onSelect: (token: NFT) => void;
}
export const TokenPickerModal: FC<TokenPickerModalProps> = observer(
  ({ onSelect, isOpen, onClose }) => {
    const handleSelect = (token: NFT) => {
      onSelect(token);
      onClose?.();
    };
    const {
      list: tokens,
      prices: { isFetching },
    } = store.tokens;
    const { list: nfts } = store.nfts
console.log("tokens", {tokens})

    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm" >
        <ModalOverlay />
        <ModalContent bg="gray.800" rounded={24} mx={4} style={{height: "50vh", overflow: "hidden"}}>
          <ModalHeader>Select NFT</ModalHeader>
          <ModalCloseButton rounded="full" />
          <ModalBody style={{flex: 1, overflow: "hidden"}}>
          <InputGroup size="lg" mb={6}>
                <InputLeftElement children={<Search />} />
                <Input rounded="full" />
              </InputGroup>
            <Flex direction="column" gap={3} style={{flex: 1, overflow: "auto", height: "100%"}}>
              {isFetching ? (
                <Spinner mx="auto" my={4} />
              ) : (
                nfts.map((nft, index) => (
                  <Flex
                    key={index}
                    onClick={() => { 
                      console.log({nft})
                      handleSelect(nft)
                     }}
                    gap={2}
                    alignItems="center"
                    rounded="full"
                    p={1}
                    pr={4}
                    transition="all 0.2s"
                    _hover={{ bg: "gray.700" }}
                    cursor="pointer"
                  >
                    <NFTImage nft={nft} />
                    <Flex direction="column" alignItems="flex-start">
                      <Text fontSize="md" fontWeight={500}>
                        {nft.symbol}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {`${nft.name} #${nft.id}`}
                      </Text>
                    </Flex>
                  </Flex>
                ))
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
  }
);

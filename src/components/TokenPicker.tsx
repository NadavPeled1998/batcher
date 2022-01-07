import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronDown } from "react-feather";

export const TokenPicker = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody></ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Flex
        direction={["column", "row"]}
        gap={[1, 5]}
        alignItems={["flex-start", "center"]}
      >
        <Button onClick={onOpen}>
          <Flex gap={5} alignItems="center">
            <span>ETH</span> <ChevronDown size="1em" />
          </Flex>
        </Button>
        <span>Balance: 1.087</span>
      </Flex>
    </>
  );
};

import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { FC } from "react";

interface ErrorModalProps extends ReturnType<typeof useDisclosure> {}
export const ErrorModal: FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent bg="gray.800" rounded={24}>
        <ModalHeader>Error</ModalHeader>
        <ModalCloseButton rounded="full" />
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            variant="ghost"
            mx="auto"
            onClick={onClose}
            rounded="full"
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

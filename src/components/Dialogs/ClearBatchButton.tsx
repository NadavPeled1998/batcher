import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  ButtonProps,
} from "@chakra-ui/react";
import { FC, useRef, useState } from "react";
import { X } from "react-feather";
import { store } from "../../store";

export const ClearBatchButton: FC<ButtonProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef<any>();

  const clearAndClose = () => {
    store.batch.clear();
    onClose();
  };

  return (
    <>
      <Button
        size="sm"
        colorScheme="primary"
        variant="ghost"
        rounded="full"
        leftIcon={<X size="1.2em" />}
        onClick={() => setIsOpen(true)}
        {...props}
      >
        Clear all
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="gray.800">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Clear Batch
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button rounded="full" ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                rounded="full"
                colorScheme="red"
                bg="red.600"
                color="white"
                onClick={clearAndClose}
                ml={3}
              >
                Clear
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { FC, useRef } from "react";
import { store } from "../../store";
interface ReplaceDialogProps extends ReturnType<typeof useDisclosure> {
  onMerge: () => void;
  onReplace: () => void;
}

export const MergeOrReplaceDialog: FC<ReplaceDialogProps> = ({
  isOpen,
  onClose,
  onMerge,
  onReplace,
}) => {
  const cancelRef = useRef(null);
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent bg="gray.800" rounded={24}>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Merge or Replace?
          </AlertDialogHeader>

          <AlertDialogBody>
            Currently there are {store.batch.items.length} items in the batch.
            Do you want to merge or replace the existing items?
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button variant="ghost" ref={cancelRef} onClick={onClose} rounded="full">
              Cancel
            </Button>
            <Button colorScheme="purple" onClick={onMerge} ml={3} rounded="full">
              Merge
            </Button>
            <Button colorScheme="primary" onClick={onReplace} ml={3} rounded="full" color="white">
              Replace
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

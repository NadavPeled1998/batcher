import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { Check, X } from "react-feather";
import { store } from "../store";
import { TokenIcon } from "./TokenPicker/TokenIcon";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}
export const ApproveModal: FC<Props> = observer(
  ({ onClose, isOpen, onSubmit }) => {
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
        <ModalOverlay />
        <ModalContent bg="gray.800" rounded={24} mx={4}>
          <ModalHeader></ModalHeader>
          <ModalCloseButton rounded="full" />
          <ModalBody d="flex" flexDirection="column" gap={2}>
            <Heading size="lg" my={2}>
              Give permission to access your tokens
            </Heading>
            <Flex direction="column" gap={3}>
              <Box>
                {/* <Text>
                  Give permission to our smart contract to transfer your tokens
                </Text> */}
                <Text>
                  By granting permission, you are allowing our smart contract to
                  transfer your funds
                </Text>
                {/* <Text fontSize="xs" color="gray.500">
                  The permission needed only once
                </Text> */}
              </Box>
              <Divider borderColor="gray.700"/>
              {Object.values(store.batch.needsApproveMap).map((token) => (
                <>
                  <Flex
                    gap={2}
                    alignItems="center"
                    key={token.token_address}
                    fontSize="sm"
                  >
                    <TokenIcon token={token.symbol} size="30" />
                    <Box>
                      <Text>{token.symbol}</Text>
                      <Text mt="-0.5" fontSize="xs" color="gray.500">
                        {token.name}
                      </Text>
                    </Box>
                    <Text
                      fontSize="xs"
                      color="gray.500"
                      d="flex"
                      gap={2}
                      ml="auto"
                    >
                      Needs permission
                    </Text>
                  </Flex>
                  <Divider borderColor="gray.700"/>
                </>
              ))}
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button
              disabled={store.commands.approveCommand.running}
              isLoading={store.commands.approveCommand.running}
              variant="ghost"
              rounded="full"
              mx="auto"
              colorScheme="primary"
              onClick={onSubmit}
              leftIcon={<Check size="1em" />}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
);

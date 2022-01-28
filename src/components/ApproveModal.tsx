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
  Stack,
  Text,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { Check, X } from "react-feather";
import { store } from "../store";
import { Ellipsis } from "./Ellipsis";
import { TokenIcon } from "./TokenPicker/TokenIcon";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}
export const ApproveModal: FC<Props> = observer(
  ({ onClose, isOpen, onSubmit }) => {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size="sm"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent
          bg="gray.800"
          rounded={24}
          mx={4}
          h="fit-content"
          maxH="100%"
        >
          <ModalHeader>
            <Stack>
              <Heading size="lg" my={2}>
                Give permission to access your tokens
              </Heading>
              <Text fontSize="md" fontWeight={300}>
                By granting permission, you are allowing our smart contract to
                transfer your funds
              </Text>
            </Stack>
          </ModalHeader>
          <ModalCloseButton rounded="full" />
          <ModalBody>
            <Divider borderColor="gray.700" mb={2}/>
            <Flex direction="column" overflowY="auto" flex={1} gap={3}>
              {Object.values(store.batch.needsApproveMap).map((token) => (
                <>
                  <Flex
                    gap={2}
                    alignItems="center"
                    key={token.token_address}
                    fontSize="sm"
                    maxW="full"
                    overflow="hidden"
                  >
                    {token.type !== 'erc721' && <TokenIcon token={token.symbol} size="30" />}
                    <Box overflow="hidden">
                      <Text>{token.symbol}</Text>
                      <Ellipsis mt="-0.5" fontSize="xs" color="gray.500">
                        {token.name}
                      </Ellipsis>
                    </Box>
                    <Text
                      fontSize="xs"
                      color="gray.500"
                      d="flex"
                      gap={2}
                      ml="auto"
                      whiteSpace="nowrap"
                    >
                      Needs permission
                    </Text>
                  </Flex>
                  <Divider borderColor="gray.700" />
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

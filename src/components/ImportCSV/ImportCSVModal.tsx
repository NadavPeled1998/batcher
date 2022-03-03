import {
  Box,
  Button,
  Center,
  CloseButton,
  Divider,
  Flex,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";
import { Download, Plus } from "react-feather";
import { useMoralis } from "react-moralis";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { useDropArea } from "react-use";
import { Token } from "../../store/prices";
import { store } from "../../store";
import { IBatchItem } from "../../store/batch";
import { BatchItemFromCSV, convertCSVToBatch, isCSV } from "../../utils/csv";
import { CSVErrors, TokenNotFoundError, NotEnoughBalanceError, SendToYourselfError } from "../../utils/errors";
import { etherToWei } from "../../utils/ethereum";
import { BatchList } from "../BatchList/BatchList";
import { Totals } from "../Totals";
import { CSVExample } from "./CSVExample";
import { ErrorModal } from "./ErrorModal";
import { InputFileButton } from "./InputFileButton";
import { MergeOrReplaceDialog } from "./MergeOrReplaceDialog";
import { checkIfNeedApprove } from "../../utils/allowance";
import { tokenMetaDataType } from "../../store/tokens";

interface ImportCSVModalProps extends ReturnType<typeof useDisclosure> {}

export const ImportCSVModal: FC<ImportCSVModalProps> = observer(
  ({ isOpen, onClose }) => {
    const errorModalController = useDisclosure();
    const mergeOrReplaceDialogController = useDisclosure();
    const [file, setFile] = useState<File>();
    const { web3, account, chainId } = useMoralis();

    const {
      data: converted,
      mutate,
      isError: isCSVError,
      error: csvError,
      reset: resetCSVError,
    } = useMutation(async () => {
      return convertCSVToBatch(file!);
    });

    const {
      data: batchItems,
      isError: isBatchItemsError,
      error: batchItemsError,
      mutate: generateBatchItems,
      reset: resetBatchItems,
    } = useMutation(async () => {
      const getToken = (item: BatchItemFromCSV) => {
        if (item.type === tokenMetaDataType.NATIVE) return store.tokens.list[0];
        if (item.type === tokenMetaDataType.ERC20)
          return store.tokens.list.find(
            (token) => token.token_address?.toLowerCase() === item.token_address?.toLowerCase()
          );
        if (item.type === tokenMetaDataType.ERC721)
          return store.nfts.get(item.token_address?.toLowerCase(), item.token_id!);
      };
      const totals: any = {}
      return converted?.baseBatch!.map((item) => {
        const token = getToken(item);
        if (!token) {
          if(item.type === tokenMetaDataType.ERC721) {
            throw new TokenNotFoundError("NFT not found", item)
          }
          throw new TokenNotFoundError("Token not found", item)
        }
        if(item.recipient_address?.toLowerCase() === account?.toLowerCase()) throw new SendToYourselfError("Send to yourself", item)

        if(item.type === tokenMetaDataType.ERC721) {
          if(!totals[token.token_address]) {
            totals[token.token_address] = []
          }
          if(totals[token.token_address].find((tokenId: string) => tokenId === item.token_id)) {
            throw new NotEnoughBalanceError("You can't send the same NFT twice", item)
          }
          else {
            totals[token.token_address].push(item.token_id)
          }
        }
        else {
          if(!totals[token.token_address]) {
            totals[token.token_address] = 0
          }
          totals[token.token_address] += Number(item.amount)
          const erc20 = token as Token
          if(web3) {
            if(Number(etherToWei(web3, totals[token.token_address], erc20.decimals)) > Number(erc20.balance)) {
              throw new NotEnoughBalanceError("Not enough balance", item);
            } 
          }
        }

        checkIfNeedApprove(web3, account, chainId, token, String(item.amount));

        return {
          address: item.recipient_address,
          amount: item.amount,
          token,
        } as IBatchItem;
      });
    });

    const [dropAreaEvents, { over: isDragOver }] = useDropArea({
      onFiles: (files) => {
        const file = files.find((f) => isCSV(f));
        if (!file || !isCSV(file))
          return toast.error("Please select a CSV file");
        setFile(file);
      },
    });

    useEffect(() => {
      if (converted?.baseBatch) {
        generateBatchItems();
      }
    }, [converted]);

    useEffect(() => {
      if (!file) return;
      mutate();
    }, [file, mutate]);

    useEffect(() => {
      if (isCSVError || isBatchItemsError) {
        errorModalController.onOpen();
      }
    }, [isCSVError, isBatchItemsError, errorModalController]);

    const clearErrors = () => {
      resetCSVError();
      resetBatchItems();
    };

    const resetCSVModal = () => {
      clearErrors();
      setFile(undefined);
    };

    const closeErrorModal = () => {
      errorModalController.onClose();
      clearErrors();
    };

    const closeImportCSVModal = () => {
      resetCSVModal();
      onClose();
      mergeOrReplaceDialogController.onClose();
    };

    const addItems = () => {
      batchItems?.forEach((item) => {
        store.batch.add(item);
      });
    };

    const replace = () => {
      store.batch.clear();
      addItems();
      closeImportCSVModal();
    };

    const merge = () => {
      addItems();
      closeImportCSVModal();
    };

    const submit = () => {
      if (store.batch.itemsLength) {
        return mergeOrReplaceDialogController.onOpen();
      }
      replace();
      closeImportCSVModal();
    };

    return (
      <>
        <MergeOrReplaceDialog
          {...mergeOrReplaceDialogController}
          onMerge={merge}
          onReplace={replace}
        />
        <ErrorModal {...errorModalController} onClose={closeErrorModal}>
          {isCSVError && (
            <Stack divider={<Divider />} spacing={4}>
              <Stack>
                <Text>
                  Filename: <Text d="inline" color="red.500">{file?.name}</Text>
                </Text>
                <Heading size="md">
                  The CSV file you selected has errors. Please fix them and try
                  again
                </Heading>
              </Stack>
              {(csvError as CSVErrors).errors.map((err) => err.jsx)}
            </Stack>
          )}
          {isBatchItemsError && (batchItemsError as TokenNotFoundError).jsx}
        </ErrorModal>
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
          <ModalOverlay />
          <ModalContent bg="gray.800" rounded={24} maxW={["3xl"]}>
            <ModalHeader>Import CSV</ModalHeader>
            <ModalCloseButton rounded="full" />
            <ModalBody p={0}>
              {Boolean(batchItems?.length) &&
              !isBatchItemsError &&
              !isCSVError ? (
                <Stack p={[4, 8]} pb={[0, 0]} spacing={[2, 4]}>
                  <HStack
                    bg="gray.900"
                    p={4}
                    rounded="lg"
                    justifyContent="space-between"
                  >
                    <Text>File: {file?.name}</Text>
                    <CloseButton onClick={resetCSVModal} />
                  </HStack>
                  <Stack bg="gray.900" p={4} rounded="lg">
                    <BatchList batch={batchItems} readonly />
                    <Totals totals={store.batch.generateTotals(batchItems!)} />
                  </Stack>
                </Stack>
              ) : (
                <Stack p={[4, 8]} spacing={[4, 8]}>
                  <Stack
                    position="relative"
                    borderStyle="dashed"
                    borderWidth={2}
                    borderColor={isDragOver ? "primary.200" : "gray.600"}
                    rounded="10px"
                    {...dropAreaEvents}
                    p={10}
                    bg="gray.900"
                  >
                    <Center
                      position="absolute"
                      pointerEvents="none"
                      top="0"
                      left="0"
                      right="0"
                      bottom="0"
                      zIndex={1}
                      opacity={isDragOver ? 1 : 0}
                      backdropFilter="auto"
                      backdropBlur="2px"
                      backdropBrightness={0.8}
                    >
                      <Box as={Plus} size={120} />
                    </Center>
                    <Stack
                      alignItems="center"
                      pointerEvents={isDragOver ? "none" : "auto"}
                    >
                      <Download size="3em" strokeWidth={1.5} />
                      <Text fontSize="xl" fontWeight={500}>
                        Drag & Drop
                      </Text>
                      <Flex gap={2} alignItems="center">
                        <Divider borderStyle="dashed" w="20" />
                        <Text fontSize={12} color="gray.400">
                          OR
                        </Text>
                        <Divider borderStyle="dashed" w="20" />
                      </Flex>
                      <InputFileButton onFileChange={setFile} />
                    </Stack>
                  </Stack>
                  <CSVExample />
                </Stack>
              )}
            </ModalBody>

            <ModalFooter hidden={!batchItems?.length}>
              <Button
                variant="solid"
                mx="auto"
                color="white"
                rounded="full"
                px={8}
                colorScheme="primary"
                onClick={submit}
                leftIcon={<Download />}
              >
                Import
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }
);

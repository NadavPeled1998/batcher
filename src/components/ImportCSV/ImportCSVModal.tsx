import {
  Box,
  Center,
  Divider,
  Flex,
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
import { DownloadCloud, Plus } from "react-feather";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { useDropArea } from "react-use";
import { store } from "../../store";
import {
  BatchItemFromCSV,
  convertCSVToBatch,
  CSVError,
  CSVErrors,
  isCSV,
} from "../../utils/csv";
import { CSVExample } from "./CSVExample";
import { InputFileButton } from "./InputFileButton";

interface ImportCSVModalProps extends ReturnType<typeof useDisclosure> {}

export const ImportCSVModal: FC<ImportCSVModalProps> = observer(
  ({ isOpen, onClose }) => {
    const { account, chainId } = useMoralis();

    const api = useMoralisWeb3Api();

    const [file, setFile] = useState<File>();

    const {
      data,
      mutate,
      isError: isReadingCSVError,
      error: readingCSVError,
      reset,
    } = useMutation(async () => {
      return convertCSVToBatch(file!);
    });

    const {
      data: batchItems,
      isLoading,
      isError,
      error,
      mutate: generateBatchItems,
    } = useMutation(async () => {
      const getToken = (item: BatchItemFromCSV) => {
        if (item.type === "native") return store.tokens.list[0];
        if (item.type === "erc20")
          return store.tokens.list.find(
            (token) => token.token_address === item.token_address
          );
        if (item.type === "erc721")
          return store.nfts.get(item.token_address, item.token_id!);
      };

      return data?.baseBatch!.map((item) => {
        const token = getToken(item);

        return {
          batchItem: {
            address: item.recipient_address,
            amount: item.amount,
            token,
          },
          hasToken: !!token,
          csvRow: item.row,
        };
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
      if (data?.baseBatch) {
        generateBatchItems();
      }
    }, [data]);

    useEffect(() => {
      if (!file) return;
      mutate();
    }, [file, mutate]);

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent bg="gray.800" rounded={24} maxW={["90%", "4xl"]}>
          <ModalHeader>Import CSV</ModalHeader>
          <ModalCloseButton rounded="full" />
          <ModalBody p={0}>
            <Stack
              hidden={Boolean(data) && !isError && !isReadingCSVError}
              p={[4, 8]}
              spacing={[4, 8]}
            >
              {isReadingCSVError && <Text>Filename: {file?.name}</Text>}
              {isReadingCSVError &&
                (readingCSVError as CSVErrors).errors.map((err) => err.jsx)}

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
                  <DownloadCloud size="3em" strokeWidth={1.5} />
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
          </ModalBody>

          {/* <ModalFooter>
            <Button size="sm" variant="ghost" mx="auto" onClick={onClose}>
              Close
            </Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    );
  }
);

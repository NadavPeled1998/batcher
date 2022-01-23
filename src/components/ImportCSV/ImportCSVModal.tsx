import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBoolean,
  useDisclosure,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { FC, useRef, useState } from "react";
import { DownloadCloud, Plus } from "react-feather";
import { toast } from "react-toastify";
import { useDropArea, useEvent } from "react-use";
import { shortenAddress } from "../../utils/address";
import { isCSV } from "../../utils/csv";
import { CSVExample } from "./CSVExample";
import { InputFileButton } from "./InputFileButton";

interface ImportCSVModalProps extends ReturnType<typeof useDisclosure> {}

export const ImportCSVModal: FC<ImportCSVModalProps> = observer(
  ({ isOpen, onClose }) => {
    const [file, setFile] = useState<File>();
    console.log("file:", file);

    const [dropAreaEvents, { over: isDragOver }] = useDropArea({
      onFiles: (files) => {
        const file = files.find((f) => isCSV(f));
        if (!file) return toast.error("Please select a CSV file");
        if (!isCSV(file)) return toastError();
        setFile(file);
      },
    });

    const stop = (fn: (...args: any) => void) => (ev: any) => {
      ev.stopPropagation();
      ev.preventDefault();
      fn(ev);
    };

    const toastError = () => {};

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent bg="gray.800" rounded={24} mx={4}>
          <ModalHeader>Import CSV</ModalHeader>
          <ModalCloseButton rounded="full" />
          <ModalBody px={[5, 10]}>
            <Stack hidden={!!file}>
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

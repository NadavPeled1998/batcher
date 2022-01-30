import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  TextProps,
  useDisclosure,
} from "@chakra-ui/react";
import { FC } from "react";
import { DownloadCloud, Settings } from "react-feather";
import { ImportCSVModal } from "./ImportCSVModal";

export const ImportCSVButton: FC<TextProps> = (props: any) => {
  const popover = useDisclosure();
  const modal = useDisclosure();

  const openCSVModal = () => {
    popover.onClose();
    modal.onOpen();
  };

  return (
    <>
      <ImportCSVModal {...modal} />
      <Popover
        isOpen={popover.isOpen}
        onClose={popover.onClose}
        onOpen={popover.onOpen}
      >
        <PopoverTrigger>
          <Text {...props} zIndex={99} color="gray.50">
            <Settings size="1em" stroke="var(--chakra-colors-gray-400)" />
          </Text>
        </PopoverTrigger>
        <PopoverContent
          bg="gray.800"
          outline="none"
          borderColor="gray.700"
          boxShadow="dark-lg"
          w="fit-content"
          maxW="240px"
          p="0"
          _focus={{ boxShadow: "none" }}
        >
          <PopoverArrow />
          <PopoverBody>
            <Button
              size="sm"
              variant="ghost"
              rounded="full"
              leftIcon={<DownloadCloud size="1em" />}
              onClick={openCSVModal}
            >
              Import CSV
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};

import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FC } from "react";
import { Search } from "react-feather";

interface TokenPickerModalProps extends ReturnType<typeof useDisclosure> {
  onSelect: (token: string) => void;
}
export const TokenPickerModal: FC<TokenPickerModalProps> = ({
  onSelect,
  isOpen,
  onClose,
}) => {
  const tokens = [
    ["LTC", "Litecoin", "150.0025"],
    ["ETH", "Ethereum", "15.647"],
    ["BTC", "Bitcoin", "0.0587"],
    ["XRP", "Ripple", "0.0025"],
  ];

  const handleSelect = (token: string) => {
    onSelect(token);
    onClose?.();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
      <ModalOverlay />
      <ModalContent bg="gray.800" rounded={24} mx={4}>
        <ModalHeader>Select token</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column" gap={3}>
            <InputGroup size="lg" mb={6}>
              <InputLeftElement children={<Search />} />
              <Input rounded="full" />
            </InputGroup>
            {tokens.map(([token, chain, value], index) => (
              <Flex
                onClick={() => handleSelect(token)}
                gap={2}
                alignItems="center"
                rounded="full"
             
                // bg="gray.700"
              >
                <img
                  key={index}
                  src={
                    require(`cryptocurrency-icons/svg/color/${token.toLowerCase()}.svg`)
                      .default
                  }
                  width="40"
                  alt="eth"
                />
                <Flex direction="column" alignItems="flex-start">
                  <Text fontSize="md" fontWeight={500}>
                    {token}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {chain}
                  </Text>
                </Flex>
                <Text ml="auto" fontWeight={500}>
                  {value}
                </Text>
              </Flex>
            ))}
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button size="sm" variant="ghost" mx="auto" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

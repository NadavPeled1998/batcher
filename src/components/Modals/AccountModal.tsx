import {
  Button,
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
import { FC, useEffect } from "react";
import { Copy, Download, ExternalLink } from "react-feather";
import { useMoralis } from "react-moralis";
import { toast } from "react-toastify";
import { useCopyToClipboard } from "react-use";
import { FeatherWallet } from "../../assets/FeatherWallet";
import { shortenAddress } from "../../utils/address";
import { networkConfigs } from "../../utils/network";

interface AccountModalProps extends ReturnType<typeof useDisclosure> {}

export const AccountModal: FC<AccountModalProps> = ({ isOpen, onClose }) => {
  const { account, web3, chainId } = useMoralis();
  const [state, copyToClipboard] = useCopyToClipboard();

  const openExplorer = () => {
    if (chainId === undefined || !networkConfigs[chainId!]) {
      return toast.error("Something went wrong. Please try again later.");
    }
    const url = `${
      networkConfigs[chainId!].blockExplorerUrl
    }address/${account}`;
    window.open(url, "_blank");
  };

  const copyAccountAddress = () => {
    copyToClipboard(account!);
  };
  useEffect(() => {
    if (!state.value) return;
    if (state.error) {
      // TODO: open a model with textarea to copy from if the it fails
      toast.error("Failed to copy to clipboard", { autoClose: 1000 });
    } else {
      toast.success("Copied to clipboard", { autoClose: 1000 });
    }
  }, [state]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent bg="gray.800" rounded={24}>
        <ModalHeader>Account</ModalHeader>
        <ModalCloseButton rounded="full" />
        <ModalBody>
          <Stack spacing={4}>
            <HStack justifyContent="space-between">
              <Text fontSize="sm">Connected with Metamask</Text>
              <Button bg="gray.700" color="white" size="xs" rounded="full">
                Disconnect
              </Button>
            </HStack>
            <HStack>
              <FeatherWallet />
              <Heading size="md" onClick={copyAccountAddress}>
                {shortenAddress(account || "")}
              </Heading>
            </HStack>
            <HStack fontSize="sm" color="gray.500" spacing={4}>
              <Button
                variant="link"
                color="inherit"
                fontWeight="normal"
                size="sm"
                leftIcon={<Copy size="1.2em" />}
                onClick={copyAccountAddress}
              >
                <Text>Copy address</Text>
              </Button>
              <Button
                variant="link"
                color="inherit"
                fontWeight="normal"
                size="sm"
                leftIcon={<ExternalLink size="1.2em" />}
                onClick={openExplorer}
              >
                <Text>View on etherscan</Text>
              </Button>
            </HStack>
          </Stack>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};

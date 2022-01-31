import {
  Flex,
  FlexProps,
  Img,
  Tab,
  TabList,
  Tabs,
  Text,
  Button,
  HStack,
  useDisclosure,
} from "@chakra-ui/react";
import { FC } from "react";
import { Wifi } from "react-feather";
import { useLocation, useNavigate } from "react-location";
import { useMoralis } from "react-moralis";
import logo from "../assets/batcher.svg";
import { FeatherWallet } from "../assets/FeatherWallet";
import { AccountModal } from "../components/Modals/AccountModal";
import { shortenAddress } from "../utils/address";
import { networkConfigs } from "../utils/network";

enum TabNames {
  Send,
  History,
  Playground,
}
const routeIndex: { [key: string]: TabNames } = {
  "/": TabNames.Send,
  "/history": TabNames.History,
};

// invert keys and values of routeIndex
const tabRoute = Object.fromEntries(
  Object.entries(routeIndex).map(([k, v]) => [v, k])
);

export const Header: FC<FlexProps> = (props) => {
  const accountModalController = useDisclosure();
  const { account, chainId, isAuthenticated, authenticate } = useMoralis();
  const navigate = useNavigate();
  const location = useLocation();
  const currentIndex = routeIndex[location.current.pathname];

  const handleTabChange = (index: number) => {
    return navigate({ to: tabRoute[index] });
  };

  return (
    <>
      <AccountModal {...accountModalController} />
      <Flex direction="column" alignItems="center" {...props}>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mb={4}
          w="100%"
        >
          <Img src={logo} w={32} />
          <Flex
            w="auto"
            colorScheme="primary"
            rounded="full"
            size="sm"
            bg="gray.900"
            variant="solid-rounded"
            color="white"
          >
            {isAuthenticated && account ? (
              <HStack fontSize={["xs", "sm"]} alignItems="center" p={1} pl={4}>
                <HStack>
                  {networkConfigs[chainId as string]?.chainName ? (
                    <>
                      <Wifi
                        strokeWidth={2}
                        size="1em"
                        color="var(--chakra-colors-green-500)"
                      />
                      <Text>
                        {networkConfigs[chainId as string]?.chainName}
                      </Text>
                    </>
                  ) : (
                    <Text color="yellow.400">Unsupported network</Text>
                  )}
                </HStack>
                <Button
                  colorScheme="primary"
                  color="white"
                  rounded="full"
                  h="auto"
                  py="1.5"
                  px={4}
                  size="sm"
                  fontSize="inherit"
                  bg="primary.300"
                  onClick={() => accountModalController.onOpen()}
                >
                  {shortenAddress(account)}
                </Button>
              </HStack>
            ) : (
              <Button
                colorScheme="primary"
                variant="ghost"
                rounded="full"
                size="md"
                leftIcon={<FeatherWallet size="1.2em" />}
                onClick={async () => await authenticate()}
              >
                Connect wallet
              </Button>
            )}
          </Flex>
        </Flex>
        <Tabs
          w="auto"
          colorScheme="primary"
          rounded="full"
          size="sm"
          bg="gray.900"
          p="1"
          index={currentIndex}
          variant="solid-rounded"
          color="white"
          onChange={handleTabChange}
        >
          <TabList>
            <Tab w="50%">
              <Text color="white">Send</Text>
            </Tab>
            <Tab w="50%">
              <Text px={4} color="white">
                History
              </Text>
            </Tab>
          </TabList>
        </Tabs>
      </Flex>
    </>
  );
};

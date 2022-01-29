import {
  Flex,
  FlexProps,
  Img,
  Tab,
  TabList,
  Tabs,
  Text,
  Button
} from "@chakra-ui/react";
import { FC } from "react";
import { useLocation, useNavigate } from "react-location";
import { useMoralis } from "react-moralis";
import logo from "../assets/batcher.svg";
import { FeatherWallet } from "../assets/FeatherWallet";
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
  "/playground": TabNames.Playground,
};

// invert keys and values of routeIndex
const tabRoute = Object.fromEntries(
  Object.entries(routeIndex).map(([k, v]) => [v, k])
);

export const Header: FC<FlexProps> = (props) => {
  const { account, chainId, isAuthenticated, authenticate } = useMoralis()
  const navigate = useNavigate();
  const location = useLocation();
  const currentIndex = routeIndex[location.current.pathname];

  const handleTabChange = (index: number) => {
    return navigate({ to: tabRoute[index] });
  };

  return (
    <Flex direction="column" alignItems="center" {...props}>
      <Flex alignItems="center" justifyContent="space-between" mb={4} w="100%">
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
            <Flex p="1" px="3" gap="2" alignItems="center" >
              {networkConfigs[chainId as string]?.chainName ? (
                <Flex size="sm">
                  {networkConfigs[chainId as string]?.chainName}
                </Flex>
              ) : (
                <Flex size="sm" color="yellow.400" >
                  Unsupported network
                </Flex>
              )}
              <Flex
                rounded="full"
                p="2"
                bg="primary.300"
                size="sm"
              >
                {shortenAddress(account)}
              </Flex>
            </Flex>
          ) : (
              <Button
                colorScheme="primary"
                mx="auto"
                mt="auto"
                variant="ghost"
                rounded="full"
                size="sm"
                leftIcon={<FeatherWallet size="1.2em" />}
                onClick={() => authenticate()}
              >
                Connect wallet
              </Button>
            )}
        </Flex>
      </Flex>
      {/* <Img src={logo} w={32} mb={4} /> */}

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
          {/* <Tab w="50%">
            <Text px={4} color="white">
              Playground
            </Text>
          </Tab> */}
        </TabList>
      </Tabs>
    </Flex>
  );
};

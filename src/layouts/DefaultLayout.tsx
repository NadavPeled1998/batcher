import { useEffect } from "react";
import { Flex } from "@chakra-ui/react";
import { Outlet, useLocation } from "react-location";
import { useAccount } from "../hooks/useAccount";
import { Header } from "./Header";
import { useMoralis } from "react-moralis";

export const DefaultLayout = () => {
  useAccount();
  const location = useLocation();

  const {
    isWeb3Enabled,
    enableWeb3,
    isAuthenticated,
    authenticate,
    isWeb3EnableLoading,
  } = useMoralis();

  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) {
      enableWeb3();
    }
  }, [isAuthenticated, isWeb3Enabled, isWeb3EnableLoading]);

  useEffect(() => {
    ;(async function connectInjected() {
      if (!isAuthenticated) {
        await authenticate()
      }
    })()
  }, []);

  return (
    <Flex
      direction="column"
      h="100vh"
      p={[2, 8]}
      pt={[4, 10]}
      pb={4}
      overflow="auto"
    >
      <Flex
        flex="1"
        direction="column"
        mx="auto"
        gap={4}
        maxW="1200px"
        w="full"
      >
        <Header zIndex={1} />
        <Flex flex={1} alignItems="flex-start">
          <Outlet key={location.current.pathname} />
        </Flex>
      </Flex>
    </Flex>
  );
};

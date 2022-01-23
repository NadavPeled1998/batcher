import { useEffect } from "react";
import { Flex } from "@chakra-ui/react";
import { Outlet, useLocation } from "react-location";
import { useAccount } from "../hooks/useAccount";
import { Header } from "./Header";
import { useMoralis } from "react-moralis";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Moralis from "moralis";
import globals from "../web3";

export const DefaultLayout = () => {
  useAccount();
  const location = useLocation();

  const {
    isWeb3Enabled,
    enableWeb3,
    isAuthenticated,
    authenticate,
    isWeb3EnableLoading,
    web3,
  } = useMoralis();

  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) {
      enableWeb3();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  useEffect(() => {
    if (!isAuthenticated) {
      authenticate();
    }
  }, []);
  
  useEffect(() => {
    if (web3) {
      globals.web3 = web3;
    }
  }, [web3]);

  return (
    <Flex
      direction="column"
      h="100vh"
      p={[2, 8]}
      pt={10}
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
          {/* <TransitionGroup>
            <CSSTransition
              key={location.current.pathname}
              classNames="fade"
              timeout={300}
            ></CSSTransition>
          </TransitionGroup> */}
        </Flex>
      </Flex>
    </Flex>
  );
};

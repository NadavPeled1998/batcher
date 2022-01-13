import { useEffect } from 'react'
import { Flex } from "@chakra-ui/react";
import { Outlet } from "react-location";
import { useAccount } from "../hooks/useAccount";
import { Header } from "./Header";
import { useMoralis } from 'react-moralis';

export const DefaultLayout = () => {
  useAccount();
  
  const { isWeb3Enabled, enableWeb3, isAuthenticated, authenticate, isWeb3EnableLoading } = useMoralis();

  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  useEffect(() => {
    if(!isAuthenticated) {
      authenticate()
    }
  }, [])

  return (
    <Flex direction="column" h="100vh" p={[4, 8]} pt={10} overflow="auto">
      <Flex direction="column" mx="auto" gap={4} maxW="1200px" w="full">
        <Header zIndex={1} />
        <Flex flex={1} alignItems="flex-start">
          <Outlet />
        </Flex>
      </Flex>
    </Flex>
  );
};

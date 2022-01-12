import { Flex } from "@chakra-ui/react";
import { Outlet } from "react-location";
import { useAccount } from "../hooks/useAccount";
import { Header } from "./Header";

export const DefaultLayout = () => {
  useAccount();

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

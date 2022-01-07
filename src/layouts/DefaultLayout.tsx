import { Flex } from "@chakra-ui/react";
import { Outlet } from "react-location";
import { Header } from "./Header";

export const DefaultLayout = () => {
  return (
    <Flex direction="column" gap={10} h="100vh" maxW="1200px" mx="auto" p="8">
      <Header />
      <Outlet />
    </Flex>
  );
};

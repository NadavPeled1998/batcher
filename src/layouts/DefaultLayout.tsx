import { Flex } from "@chakra-ui/react";
import { Outlet } from "react-location";
import { Header } from "./Header";

export const DefaultLayout = () => {
  return (
    <Flex
      direction="column"
      gap={10}
      h="100vh"
      maxW="1200px"
      mx="auto"
      p="8"
      overflow="auto"
    >
      <Header
        position="sticky"
        top="0"
        backdropBlur={"2xl"}
        zIndex={8988}
        style={{ backdropFilter: "blur(4px)" }}
      />
      <Flex flex={1}>
        <Outlet />
      </Flex>
    </Flex>
  );
};

import { Box, Flex, Heading, Img, Tab, TabList, Tabs } from "@chakra-ui/react";
import logo from "../assets/logo.svg";

export const Header = () => {
  return (
    <Flex direction="column" alignItems="center" gap="2">
      <Img src={logo} w={32} />
      <Tabs colorScheme="primary">
        <TabList>
          <Tab rounded={4}>Send</Tab>
          <Tab rounded={4}>Pending</Tab>
          <Tab rounded={4}>History</Tab>
        </TabList>
      </Tabs>
    </Flex>
  );
};

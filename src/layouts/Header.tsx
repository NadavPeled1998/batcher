import {
  Box,
  Flex,
  Heading,
  Img,
  Tab,
  TabList,
  Tabs,
  Text,
} from "@chakra-ui/react";
import logo from "../assets/logo.svg";

export const Header = () => {
  return (
    <Flex direction="column" alignItems="center" gap="2">
      <Img src={logo} w={32} />

      <Tabs
        colorScheme="primary"
        rounded="full"
        // variant="solid-rounded"
        color="white"
        onChange={(...rest) => console.log("change", rest)}
      >
        <TabList>
          <Tab>
            <Text color="white">Send</Text>
          </Tab>
          <Tab>
            <Text px={4} color="white">
              Manage
            </Text>
          </Tab>
          <Tab>
            <Text px={4} color="white">
              History
            </Text>
          </Tab>
        </TabList>
      </Tabs>
    </Flex>
  );
};

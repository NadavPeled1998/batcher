import {
  Box,
  Button,
  Flex,
  FlexProps,
  Heading,
  Img,
  Tab,
  TabList,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { FC } from "react";
import logo from "../assets/logo.svg";
import { useAuth } from "../hooks/useAuth";

export const Header: FC<FlexProps> = (props) => {
  const { authenticate, isAuthenticated } = useAuth();
  return (
    <Flex direction="column" alignItems="center" gap="2" {...props}>
      <Img src={logo} w={32} />

      <Tabs
        colorScheme="primary"
        rounded="full"
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
      {/* <Button onClick={authenticate}>
        {isAuthenticated ? "Connected!" : "Connect wallet"}
      </Button> */}
    </Flex>
  );
};

import {
  Flex,
  FlexProps, Img,
  Tab,
  TabList,
  Tabs,
  Text
} from "@chakra-ui/react";
import { FC } from "react";
import logo from "../assets/batcher.svg";

export const Header: FC<FlexProps> = (props) => {
  return (
    <Flex direction="column" alignItems="center"  {...props}>
      <Img src={logo} w={32} mb={4}/>

      <Tabs
        
        w="auto"
        colorScheme="primary"
        rounded="full"
        size="sm"
        bg="gray.900"
        p="1"
        variant="solid-rounded"
        color="white"
        onChange={(...rest) => console.log("change", rest)}
      >
        <TabList>
          <Tab w="33.33%">
            <Text color="white">Send</Text>
          </Tab>
          <Tab w="33.33%">
            <Text px={4} color="white">
              Manage
            </Text>
          </Tab>
          <Tab w="33.33%">
            <Text px={4} color="white">
              History
            </Text>
          </Tab>
        </TabList>
      </Tabs>
    </Flex>
  );
};

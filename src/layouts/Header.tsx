import {
  Flex,
  FlexProps,
  Img,
  Tab,
  TabList,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { FC } from "react";
import { useRouter, useNavigate, useMatch, useLocation } from "react-location";
import logo from "../assets/batcher.svg";

enum TabNames {
  Send,
  Manage,
  History,
}
const routeIndex: { [key: string]: TabNames } = {
  "/": TabNames.Send,
  "/manage": TabNames.Manage,
  "/history": TabNames.History,
};

// invert keys and values of routeIndex
const tabRoute = Object.fromEntries(
  Object.entries(routeIndex).map(([k, v]) => [v, k])
);

export const Header: FC<FlexProps> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentIndex = routeIndex[location.current.pathname];

  const handleTabChange = (index: number) => {
    return navigate({ to: tabRoute[index] });
  };

  return (
    <Flex direction="column" alignItems="center" {...props}>
      <Img src={logo} w={32} mb={4} />

      <Tabs
        w="auto"
        colorScheme="primary"
        rounded="full"
        size="sm"
        bg="gray.900"
        p="1"
        index={currentIndex}
        variant="solid-rounded"
        color="white"
        onChange={handleTabChange}
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

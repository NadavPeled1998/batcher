import { Box, Divider, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { Clock, Layers } from "react-feather";
import { store } from "../../store";
import { HistoryListItem } from "./components/HistoryListItem";

export const History = observer(() => {
  const isLast = (index: number) => index === store.history.list.length - 1;
  return (
    <Flex direction="column" w="900px" maxW="full" mx="auto">
      <Flex
        direction="column"
        // bg="gray.900"
        w="full"
        mx="auto"
        px={[2, 4]}
        py="4"
        gap="2"
        overflow="auto"
        rounded="lg"
      >
        <Flex alignItems="center" gap={2}>
          <Clock />
          <Heading size="lg">History</Heading>
        </Flex>
        <Text color="gray.500" fontSize="xs">
          Here you can see all the batches you have sent
        </Text>
        {/* <Flex gap={2} fontSize="sm" alignItems="center">
          <Text rounded="full" color="primary.200">
            10/15/21
          </Text>
          <ChevronDown color="var(--chakra-colors-primary-200)" size="1.2em" />
        </Flex> */}
      </Flex>
      <Flex
        hidden={!store.history.isFetching}
        direction="column"
        alignItems="center"
        bg="gray.900"
        w="full"
        p={[4, 8]}
        gap="4"
        overflow="auto"
        rounded="lg"
      >
        <Spinner mx="auto" size="xl" />
        <Text fontSize="sm">Fetching History...</Text>
      </Flex>
      <Flex
        hidden={store.history.isFetching}
        direction="column"
        bg="gray.900"
        w="full"
        mx="auto"
        p={[4, 8]}
        gap="2"
        overflow="auto"
        rounded="lg"
      >
        {store.history.list.length ? (
          store.history.list.map((item, i) => {
            return (
              <Flex 
                key={item.transaction.hash} 
                direction="column"
                gap="2"
              >
                <HistoryListItem item={item} />
                {isLast(i) ? null : <Divider borderColor="gray.700"/>}
              </Flex>
            );
          })
        ) : (
          <Flex direction="column" alignItems="center" p={4}>
            <Box mx="auto">
              <Layers color="var(--chakra-colors-primary-200)" />
            </Box>
            <Text mt={3} mx="auto" fontSize="xs" color="gray.500">
              No history yet
            </Text>
            <Text mx="auto" fontSize="sm">
              Go make some history!
            </Text>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
});

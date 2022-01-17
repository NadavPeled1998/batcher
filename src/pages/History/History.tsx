import { Box, Divider, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { ChevronDown } from "react-feather";
import { FeatherGasStation } from "../../assets/FeatherGasStation";
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
        <Heading size="lg">History</Heading>
        <Flex gap={2} fontSize="sm" alignItems="center">
          <Text>Filter by date</Text>
          <Text rounded="full" color="primary.200">
            10/15/21
          </Text>
          <ChevronDown color="var(--chakra-colors-primary-200)" size="1.2em" />
        </Flex>
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
          store.history.list.map((item, i) => (
            <>
              <HistoryListItem item={item} />
              {isLast(i) ? null : <Divider />}
            </>
          ))
        ) : (
          <>
            <Box mx="auto">
              <FeatherGasStation
                stroke="none"
                size="45"
                fill="var(--chakra-colors-primary-500)"
              />
            </Box>
            <Text mx="auto" fontSize="xs" color="gray.500">
              No history yet
            </Text>
            <Text mx="auto" fontSize="sm">
              Go make some history!
            </Text>
          </>
        )}
      </Flex>
    </Flex>
  );
});

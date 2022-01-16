import { Divider, Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { store } from "../../store";
import { HistoryListItem } from "./components/HistoryListItem";

export const History = observer(() => {
  const isLast = (index: number) => index === store.history.list.length - 1;
  return (
    <Flex
      direction="column"
      bg="gray.900"
      w="786px"
      mx="auto"
      p="8"
      gap="2"
      overflow="auto"
      rounded="lg"
    >
      {store.history.list.map((item, i) => (
        <>
          <HistoryListItem item={item} />
          {isLast(i) ? null : <Divider />}
        </>
      ))}
    </Flex>
  );
});

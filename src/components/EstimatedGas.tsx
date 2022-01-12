import { Flex, Text } from "@chakra-ui/react";
import { store } from "../store";
import { FeatherGasStation } from "../assets/FeatherGasStation";
import { observer } from "mobx-react-lite";

export const EstimatedGas = observer(() => (
  <Flex
    hidden={!store.batch.items.length}
    alignItems="center"
    justifyContent="center"
    fontSize="sm"
    color="gray.400"
    gap={1}
  >
    <FeatherGasStation stroke="none" fill="var(--chakra-colors-primary-200)" />
    <Text>Gas:</Text>
    <Text color="primary.200">
      ${(store.batch.items.length * 0.42).toFixed(2)}
    </Text>
    <Text>instead of</Text>
    <Text decoration="line-through" color="yellow.800">
      ${(store.batch.items.length * 2.48).toFixed(2)}
    </Text>
  </Flex>
));

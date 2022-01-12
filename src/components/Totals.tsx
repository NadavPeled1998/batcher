import { Divider, Flex, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { store } from "../store";
import { formatNumber } from "../utils/currency";

export const Totals = observer(() => (
  <Flex hidden={!store.batch.items.length} direction="column" gap={1}>
    <Text fontSize="sm" color="gray.400">
      Totals
    </Text>
    <Divider />
    <Flex gap={3} flexWrap="wrap">
      {Object.values(store.batch.totals).map(({ token, total }) => (
        <Flex gap="1" fontSize="sm" alignItems="center" key={token.symbol}>
          <Text>{token.symbol}</Text>
          <Text fontWeight="bold">{formatNumber(total, +token.decimals)}</Text>
          <Text fontSize="xs">
            ($
            {formatNumber(
              total * store.tokens.prices.get(token.token_address)?.usdPrice || 0
            )}
            )
          </Text>
        </Flex>
      ))}
    </Flex>
  </Flex>
));

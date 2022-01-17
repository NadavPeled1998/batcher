import { Divider, Flex, FlexProps, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { store } from "../store";
import { TotalsMap } from "../store/batch";
import { formatNumber } from "../utils/currency";
interface TotalProps extends FlexProps {
  totals?: TotalsMap;
}

export const Totals: FC<TotalProps> = observer(({ totals, ...props }) => {
  const items = Object.values(totals || store.batch.totals);

  return (
    <Flex direction="column" gap={1} {...props}>
      <Text fontSize="sm" color="gray.400">
        Totals
      </Text>
      <Divider borderColor="gray.700" />
      <Flex gap={3} flexWrap="wrap">
        {items.map(({ token, total }) => (
          <Flex gap="1" fontSize="sm" alignItems="center" key={token.symbol}>
            <Text color="gray.400">{token.symbol}</Text>
            <Text fontWeight="medium">{formatNumber(total, 6)}</Text>
            <Text fontSize="xs">
              ($
              {formatNumber(
                total * store.tokens.prices.get(token.address)?.usdPrice || 0
              )}
              )
            </Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
});

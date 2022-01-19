import { Divider, Flex, FlexProps, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { store } from "../store";
import { NFT } from "../store/nfts";
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
        {items.map(({ token, total }) => {
        if(token.type === 'erc721') {
          const nft = token as NFT;
          return (
            <Flex gap="1" fontSize="sm" alignItems="center" key={nft.symbol}>
          <Text color="gray.400">{nft.symbol}</Text>
          <Text fontSize="xs">
            {`${nft.name} #${nft.id}`}
          </Text>
        </Flex>
          )
        }
        return(
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
      )})}
      </Flex>
    </Flex>
  );
});

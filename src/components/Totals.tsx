import { Divider, Flex, FlexProps, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { store } from "../store";
import { NFT } from "../store/nfts";
import { formatNumber } from "../utils/currency";

export const Totals: FC<FlexProps> = observer((props) => (
  <Flex
    hidden={!store.batch.items.length}
    direction="column"
    gap={1}
    {...props}
  >
    <Text fontSize="sm" color="gray.400">
      Totals
    </Text>
    <Divider />
    <Flex gap={3} flexWrap="wrap">
      {Object.values(store.batch.totals).map(({ token, total }) => {
        if(token.type === 'erc721') {
          const nft = token as NFT;
          return (
            <Flex gap="1" fontSize="sm" alignItems="center" key={nft.symbol}>
          <Text>{nft.symbol}</Text>
          <Text fontSize="xs">
            {`${nft.name} #${nft.id}`}
          </Text>
        </Flex>
          )
        }
        return(
        <Flex gap="1" fontSize="sm" alignItems="center" key={token.symbol}>
          <Text>{token.symbol}: {token.type}</Text>
          <Text fontWeight="bold">{formatNumber(total, +token.decimals)}</Text>
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
));

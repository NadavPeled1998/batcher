import { Flex, Text } from "@chakra-ui/react";
import { store } from "../store";
import { FeatherGasStation } from "../assets/FeatherGasStation";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useMoralis } from "react-moralis";
import { NATIVE_ADDRESS_0x0, NATIVE_ADDRESS_0xE } from "../utils/network";
import { formatNumber } from "../utils/currency";

interface Props {
  gasFee: string;
  externalGasFee: string;
}
export const EstimatedGas: FC<Props> = observer(
  ({ gasFee, externalGasFee }) => {
    const { web3 } = useMoralis();

    const fromWei = (value: string) =>
      Number(web3?.utils.fromWei(value, "ether"));

    const symbol = store.tokens.native.symbol;
    const native0xe = store.tokens.prices.map[NATIVE_ADDRESS_0xE];
    const native0x0 = store.tokens.prices.map[NATIVE_ADDRESS_0x0];
    const usdPrice = (native0x0 || native0xe)?.usdPrice || 0;

    const gasEth = formatNumber(fromWei(gasFee), 6);
    const gasUSD = formatNumber(+gasEth * usdPrice);

    const externalGasEth = formatNumber(fromWei(externalGasFee), 6);
    const externalGasUSD = formatNumber(+externalGasEth * usdPrice);

    const displayGas = usdPrice ? `$${gasUSD}` : `${gasEth} ${symbol}`;
    const displayExternalGas = usdPrice
      ? `$${externalGasUSD}`
      : `${externalGasEth} ${symbol}`;

    return (
      <Flex
        hidden={+gasFee >= +externalGasFee}
        alignItems="center"
        justifyContent="center"
        fontSize="sm"
        color="gray.400"
        gap={1}
      >
        <FeatherGasStation
          stroke="none"
          fill="var(--chakra-colors-primary-200)"
        />
        <Text>Gas: </Text>
        <Text color="primary.200">{displayGas}</Text>
        <Text>instead of</Text>
        <Text decoration="line-through" color="yellow.800">
          {displayExternalGas}
        </Text>
      </Flex>
    );
  }
);

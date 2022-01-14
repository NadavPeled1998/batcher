import { Flex, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { store } from "../store";
import Moralis from "moralis";
import { formatNumber } from "../utils/currency";
import { ArrowUp } from "react-feather";
import { useMoralis } from "react-moralis";

export const SelectedTokenBalance = observer(() => {
  const { balance } = store.form.selectedToken;
  const { web3 } = useMoralis();
  const formattedBalance = formatNumber(Moralis.Units.FromWei(balance, 18), 6);

  if (!web3) return null;

  const setMax = () => {
    const { toBN, fromWei } = web3.utils;
    const gas = toBN("1000000");
    const weiBalance = toBN(store.form.selectedToken.balance);

    const max = fromWei(weiBalance.sub(gas), "ether");
    store.form.updateAmount(+max);
  };

  return (
    <Text fontSize="xs" gap={2}>
      <Text color="gray.500" d="inline">
        Balance:
      </Text>{" "}
      {formattedBalance}{" "}
      <Flex
        color="primary.200"
        d="inline-flex"
        alignItems="center"
        onClick={setMax}
      >
        <ArrowUp size="1em" /> <Text>Max</Text>
      </Flex>
    </Text>
  );
});

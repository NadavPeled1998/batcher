import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Tab,
  TabList,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { AlertTriangle, ArrowUp, Layers } from "react-feather";
import { useMoralis } from "react-moralis";
import { TokenPicker } from "../components/TokenPicker/TokenPicker";
import { useSendForm } from "../hooks/useSendForm";
import { store } from "../store";
import { AddressInput } from "./AddressInput";
import { BatchList } from "./BatchList/BatchList";
import { EstimatedGas } from "./EstimatedGas";
import { InputType, TokenAmountInput } from "./TokenAmountInput";
import { Totals } from "./Totals";
import { FeatherWallet } from "../assets/FeatherWallet";

export const SendForm: FC = observer(() => {
  const {
    submit,
    amountController,
    addressController,
    tokenController,
    formState: { errors },
    sendTransaction,
  } = useSendForm();

  const { authenticate, isAuthenticated, isWeb3Enabled, account } =
    useMoralis();

  const isConnected = isAuthenticated && isWeb3Enabled && account;

  return (
    <Flex
      as="form"
      direction={["column", "column", "column", "row"]}
      gap={8}
      bg="gray.900"
      p={[7, 10]}
      h="auto"
      rounded="40px"
      maxW="full"
      mx="auto"
      onSubmit={submit}
    >
      <Flex
        alignItems="center"
        direction="column"
        w="sm"
        maxW="full"
        gap={8}
        bg="gray.900"
      >
        <FormControl colorScheme="primary" isInvalid={Boolean(errors.address)}>
          <FormLabel
            fontSize="sm"
            textAlign="center"
            htmlFor="address"
            color="muted.200"
          >
            Recipient Address
          </FormLabel>
          <AddressInput {...addressController} />
          <FormErrorMessage>
            <Text textAlign="center" mx="auto">
              {errors.address && errors.address.message}
            </Text>
          </FormErrorMessage>
        </FormControl>

        <FormControl
          d="grid"
          alignContent="center"
          gap={1}
          gridTemplateAreas={`
          "label"
          "picker"
          "amount"
          "error"
          "usd"
          "toggle"
          "divider"
        `}
          textAlign="center"
          colorScheme="primary"
          fontWeight={500}
          isInvalid={Boolean(errors.amount)}
        >
          <FormLabel
            textAlign="center"
            gridArea="label"
            fontSize="sm"
            htmlFor="address"
            color="muted.200"
          >
            Select token
          </FormLabel>

          <Flex direction="column" alignItems="center" gridArea="toggle">
            <Tabs
              colorScheme="primary"
              mx="auto"
              mt="4"
              p="0.5"
              index={store.form.amount.type}
              style={
                !store.form.canInputFiat
                  ? {
                      pointerEvents: "none",
                      opacity: 0.5,
                    }
                  : {}
              }
              bg="gray.700"
              rounded="full"
              variant="solid-rounded"
              size="sm"
              color="white"
              onChange={(type) => store.form.setAmountInputType(type)}
            >
              <TabList>
                <Tab py="0.5" px="4">
                  <Text color="white">{tokenController.value?.symbol}</Text>
                </Tab>
                <Tab py="0.5" px="4">
                  <Text color="white">USD</Text>
                </Tab>
              </TabList>
            </Tabs>
            <Text
              d="flex"
              gap={1}
              alignItems="center"
              hidden={store.form.canInputFiat}
              fontSize="xs"
            >
              <AlertTriangle
                color="var(--chakra-colors-orange-400)"
                size="1em"
              />{" "}
              No USD price for that
            </Text>
          </Flex>
          <Box gridArea="picker" mx="auto">
            <TokenPicker {...tokenController} />
          </Box>
          <Box gridArea="amount">
            <TokenAmountInput
              placeholder={
                store.form.amount.type === InputType.Token ? "0.00" : "$0.00"
              }
              inputType={store.form.amount.type}
              {...amountController}
              style={{
                background: "none",
                outline: "none",
                fontSize: "2.5em",
                flex: 1,
                textAlign: "center",
                width: "100%",
              }}
            />
          </Box>

          <Text gridArea="usd" fontSize="sm" color="muted.200">
            0.00 USD
          </Text>
          <FormErrorMessage
            d="flex"
            flexDir="column"
            gridArea="error"
            textAlign="center"
          >
            <ArrowUp size="1.2em" />
            <Text mx="auto" d="flex" alignItems="center">
              {errors.amount && errors.amount.message}
            </Text>
          </FormErrorMessage>
        </FormControl>
        {isConnected ? (
          <Button
            type="submit"
            colorScheme="primary"
            w={32}
            mx="auto"
            variant="ghost"
            rounded="full"
            disabled={Boolean(errors.address)}
            leftIcon={<Layers />}
          >
            Batch
          </Button>
        ) : (
          <Button
            colorScheme="primary"
            mx="auto"
            variant="ghost"
            rounded="full"
            disabled={Boolean(errors.address)}
            leftIcon={<FeatherWallet />}
            onClick={() => authenticate()}
          >
            Connect Wallet
          </Button>
        )}
      </Flex>
      <Center
        hidden={!store.batch.items.length}
        height={["0", "0", "0", "430px"]}
      >
        <Divider orientation="vertical" h="full" />
      </Center>
      <Flex
        hidden={!store.batch.items.length}
        direction="column"
        w={["full", "full", "full", "xs"]}
        gap={8}
        bg="gray.900"
      >
        <BatchList />
        <Totals />
        <EstimatedGas />
        <Button
          hidden={!store.batch.items.length}
          rounded="full"
          colorScheme="primary"
          disabled={Boolean(errors.address)}
          size="lg"
          variant="outline"
          onClick={sendTransaction}
        >
          {store.batch.items.length === 1
            ? "Send"
            : `Send Batch (${store.batch.items.length})`}
        </Button>
      </Flex>
    </Flex>
  );
});

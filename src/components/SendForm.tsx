import {
  Box,
  Button,
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
import { AlertTriangle, ArrowUp, Layers, Triangle } from "react-feather";
import { TokenPicker } from "../components/TokenPicker/TokenPicker";
import { useSendForm } from "../hooks/useSendForm";
import { store } from "../store";
import { AddressInput } from "./AddressInput";
import { BatchList } from "./BatchList/BatchList";
import { EstimatedGas } from "./EstimatedGas";
import { InputType, TokenAmountInput } from "./TokenAmountInput";
import { Totals } from "./Totals";

export const SendForm: FC = observer(() => {
  const {
    submit,
    amountController,
    addressController,
    tokenController,
    formState: { errors },
  } = useSendForm();

  return (
    <Flex
      as="form"
      direction="column"
      gap={8}
      bg="gray.900"
      p={[7, 10]}
      h="auto"
      w="md"
      rounded="40px"
      maxW="full"
      mx="auto"
      onSubmit={submit}
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
            <AlertTriangle color="var(--chakra-colors-orange-400)" size="1em" /> No USD price for that
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
      >
        {!store.batch.items.length
          ? "Send"
          : `Send Batch (${store.batch.items.length})`}
      </Button>
    </Flex>
  );
});

import {
  Box,
  Button,
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
import { ArrowUp, Layers, X } from "react-feather";
import { FeatherGasStation } from "../assets/FeatherGasStation";
import { BatchItem } from "../components/BatchItem";
import { TokenPicker } from "../components/TokenPicker";
import { useSendForm } from "../hooks/useSendForm";
import { store } from "../store";
import { AddressInput } from "./AddressInput";
import { ClearBatchDialog } from "./Dialogs/ClearBatchDialog";
import { InputType, TokenAmountInput } from "./TokenAmountInput";

export const SendForm: FC = observer(() => {
  const {
    submit,
    amountController,
    addressController,
    tokenController,
    getValues,
    formState: { errors },
  } = useSendForm();

  const { token } = getValues();

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
        <Tabs
          gridArea="toggle"
          colorScheme="primary"
          mx="auto"
          mt="4"
          p="0.5"
          defaultIndex={store.sendFrom.amountInputType}
          bg="gray.700"
          rounded="full"
          variant="solid-rounded"
          size="sm"
          color="white"
          onChange={(type) => store.sendFrom.setAmountInputType(type)}
        >
          <TabList>
            <Tab py="0.5" px="4">
              <Text color="white">{token ? token.symbol : "ETH"}</Text>
            </Tab>
            <Tab py="0.5" px="4">
              <Text color="white">USD</Text>
            </Tab>
          </TabList>
        </Tabs>
        <Box gridArea="picker" mx="auto">
          <TokenPicker {...tokenController} />
        </Box>
        <Box gridArea="amount">
          <TokenAmountInput
            placeholder={
              store.sendFrom.amountInputType === InputType.Token
                ? "0.00"
                : "$0.00"
            }
            inputType={store.sendFrom.amountInputType}
            {...amountController}
            style={{
              background: "none",
              outline: "none",
              fontSize: "2.5em",
              flex: 1,
              textAlign: "center",
              width: "100%",
              // color:
              //   store.sendFrom.amountInputType === InputType.Token
              //     ? "var(--chakra-colors-primary-200)"
              //     : "white",
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
      >
        <Flex experimental_spaceX="2" alignItems="center">
          <Layers />
          <span>Batch</span>
        </Flex>
      </Button>

      {store.batch.items.length > 0 && (
        <Box experimental_spaceY={2}>
          <Flex alignItems="center" justifyContent="space-between">
            <Text fontSize="sm" color="gray.400">
              Batch
            </Text>
            <ClearBatchDialog />
          </Flex>
          <Divider hidden={!store.batch.items.length} />
          <Flex direction="column" maxH="200px" overflowY="auto">
            {store.batch.items
              .slice()
              .reverse()
              .map((item, index) => (
                <BatchItem key={index} item={item} />
              ))}
          </Flex>
        </Box>
      )}

      <Flex hidden={!store.batch.items.length} direction="column" gap={1}>
        <Text fontSize="sm" color="gray.400">
          Totals
        </Text>
        <Divider />
        <Flex gap={2}>
          {Object.entries(store.batch.totals).map(([token, total]) => (
            <Flex gap="1" fontSize="sm" key={token}>
              <Text>{token}</Text>
              <Text fontWeight="bold">{total}</Text>
            </Flex>
          ))}
        </Flex>
        <Flex
          alignItems="center"
          justifyContent="flex-end"
          fontSize="sm"
          color="gray.400"
          gap={1}
        >
          <FeatherGasStation
            stroke="none"
            fill="var(--chakra-colors-primary-200)"
          />
          <Text>Gas:</Text>
          <Text color="primary.200">
            ${(store.batch.items.length * 0.42).toFixed(2)}
          </Text>
          <Text>instead of</Text>
          <Text decoration="line-through" color="yellow.800">
            ${(store.batch.items.length * 2.48).toFixed(2)}
          </Text>
        </Flex>
      </Flex>

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

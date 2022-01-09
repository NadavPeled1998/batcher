import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Tab,
  TabList,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useCallback } from "react";
import { ArrowUp, Layers } from "react-feather";
import { BatchItem } from "../components/BatchItem";
import { TokenPicker } from "../components/TokenPicker";
import { useSendForm } from "../hooks/useSendForm";
import { AddressInput } from "./AddressInput";
import { TokenAmountInput } from "./TokenAmountInput";

export const SendForm = () => {
  const {
    register,
    handleSubmit,
    setAmount,
    formState: { errors },
  } = useSendForm();

  const submit = (...rest: any) => {
    console.log("submit", rest);
  };

  console.count("render");

  return (
    <Flex
      key={"unique2"}
      as="form"
      direction="column"
      gap={10}
      w="xl"
      maxW="full"
      mx="auto"
      onSubmit={handleSubmit(submit)}
    >
      <FormControl colorScheme="primary" isInvalid={Boolean(errors.address)}>
        <FormLabel fontSize="sm" htmlFor="address" color="muted.200">
          Recipient Address
        </FormLabel>
        <AddressInput {...register("address")} />
        <FormErrorMessage>
          <ArrowUp size="1.2em" /> {errors.address && errors.address.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl
        d="flex"
        flexDirection="column"
        gap={2}
        colorScheme="primary"
        fontWeight={500}
        isInvalid={Boolean(errors.amount)}
      >
        <Flex alignItems="flex-end" key={"unique1"}>
          <FormLabel fontSize="sm" htmlFor="address" color="muted.200">
            Select token
          </FormLabel>
          <Tabs
            ml="auto"
            colorScheme="primary"
            p={1}
            bg="gray.700"
            rounded="full"
            variant="solid-rounded"
            size="sm"
            color="white"
            onChange={(...rest) => console.log("change", rest)}
          >
            <TabList>
              <Tab>
                <Text color="white">ETH</Text>
              </Tab>
              <Tab>
                <Text color="white">USD</Text>
              </Tab>
            </TabList>
          </Tabs>
        </Flex>
        <Flex alignItems="center" p={2} bg="gray.700" rounded={10}>
          <TokenPicker />
          <TokenAmountInput
            key={"unique"}
            inputType={0}
            // {...register("amount")}
            onValueChange={setAmount}
            {...register("amount")}
            customInput={(props) => (
              <Input
                flex={1}
                pl={4}
                textAlign="right"
                fontSize="4xl"
                variant="unstyled"
                placeholder="0.00"
                {...props}
              />
            )}
          />
        </Flex>
        <Flex>
          <Text hidden fontSize="sm" color="muted.200">
            Balance: 157,585 ETH
          </Text>
          <Text ml="auto" fontSize="sm" color="muted.200">
            0.00 USD
          </Text>
        </Flex>
        <Divider mt={2} />
        <FormErrorMessage alignSelf="flex-end">
          {errors.amount && errors.amount.message} <ArrowUp size="1.2em" />
        </FormErrorMessage>
      </FormControl>

      <Button
        type="submit"
        colorScheme="primary"
        w={32}
        mx="auto"
        variant="ghost"
        disabled={Boolean(errors.address)}
      >
        <Flex experimental_spaceX="2" alignItems="center">
          <Layers />
          <span>Batch</span>
        </Flex>
      </Button>

      <Flex direction="column">
        <BatchItem />
        <BatchItem />
        <BatchItem />
      </Flex>

      <Button
        colorScheme="primary"
        disabled={Boolean(errors.address)}
        size="lg"
        variant="outline"
      >
        Send
      </Button>
    </Flex>
  );
};

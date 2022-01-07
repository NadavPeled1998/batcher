import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Tab,
  TabList,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { Check, Layers } from "react-feather";
import { useSendForm } from "../hooks/useSendForm";
import { TokenPicker } from "../components/TokenPicker";
import { BatchItem } from "../components/BatchItem";

export const SendForm = () => {
  const { register, handleSubmit, errors } = useSendForm();
  const submit = (...rest: any) => {
    console.log("asdas", rest);
  };

  return (
    <Flex
      as="form"
      direction="column"
      gap={10}
      w="xl"
      maxW="full"
      mx="auto"
      onSubmit={handleSubmit(submit)}
    >
      <FormControl colorScheme="primary" isInvalid={Boolean(errors.address)}>
        <FormLabel htmlFor="address" color="muted.200">
          Recipient Address
        </FormLabel>
        <InputGroup>
          <Input
            id="address"
            variant="flushed"
            placeholder="Ethereum address"
            colorScheme="primary.200"
            {...register("address")}
          />
          {/* <InputRightElement children={<Check />} /> */}
        </InputGroup>
        <FormErrorMessage color="primary.200">
          {errors.address && errors.address.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl colorScheme="primary" fontWeight={500}>
        <Flex alignItems="flex-end">
          <FormLabel htmlFor="address" color="muted.200">
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
        <Flex alignItems="center">
          <TokenPicker />
          <Input
            pl={4}
            textAlign="end"
            fontSize="4xl"
            variant="unstyled"
            placeholder="0.00"
            type="number"
          />
        </Flex>
        <Flex>
          <Text fontSize="sm" color="muted.200">
            Balance: 157,585 ETH
          </Text>
          <Text ml="auto" fontSize="sm" color="muted.200">
            0.00 USD
          </Text>
        </Flex>
        <Divider mt={2} />
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

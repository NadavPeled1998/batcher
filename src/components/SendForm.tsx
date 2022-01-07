import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { Layers } from "react-feather";
import { useSendForm } from "../hooks/useSendForm";
import { TokenPicker } from "../components/TokenPicker";

export const SendForm = () => {
  const { register, handleSubmit, errors } = useSendForm();
  const submit = (...rest: any) => {
    console.log("asdas", rest);
  };

  return (
    <Flex
      as="form"
      direction="column"
      gap={5}
      w="xl"
      maxW="full"
      mx="auto"
      onSubmit={handleSubmit(submit)}
    >
      <FormControl colorScheme="primary" isInvalid={Boolean(errors.address)}>
        <FormLabel htmlFor="address" color="muted.200">
          Recipient Address
        </FormLabel>
        <Input
          id="address"
          variant="flushed"
          placeholder="Ethereum address"
          colorScheme="primary.200"
          {...register("address")}
        />
        <FormErrorMessage color="primary.200">
          {errors.address && errors.address.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl colorScheme="primary" fontWeight={500}>
        <FormLabel htmlFor="address" color="muted.200">
          Select token
        </FormLabel>
        <TokenPicker />
      </FormControl>

      <Button
        type="submit"
        colorScheme="primary"
        w={32}
        mx="auto"
        variant="ghost"
      >
        <Flex experimental_spaceX="2" alignItems="center">
          <Layers />
          <span>Batch</span>
        </Flex>
      </Button>

      <Button colorScheme="primary" disabled size="lg" variant="outline">
        Send
      </Button>
    </Flex>
  );
};

import {
  CloseButton,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement
} from "@chakra-ui/react";
import React, { forwardRef } from "react";
import { FeatherWallet } from "../assets/FeatherWallet";

interface Props extends React.ComponentProps<typeof Input> {
  clear: () => void;
}

export const AddressInput = forwardRef<HTMLInputElement, Props>(
  ({ clear, ...props }, ref) => {
    const showClearBtn = !!props.value;

    return (
      <InputGroup disabled size="lg">
        <InputLeftElement children={<FeatherWallet size="1.2em" />} />
        <Input
          id="address"
          variant="outline"
          colorScheme="gray"
          rounded="full"
          fontSize="md"
          ref={ref}
          {...props}
        />
        <InputRightElement hidden={!showClearBtn}>
          <Flex alignItems="center">
            <CloseButton rounded="full" onClick={clear} />
          </Flex>
        </InputRightElement>
      </InputGroup>
    );
  }
);

import {
  CloseButton,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import React, { forwardRef, useState } from "react";
import { FeatherWallet } from "../assets/FeatherWallet";

type Props = React.ComponentProps<typeof Input>;

export const AddressInput = forwardRef<HTMLInputElement, Props>(
  (props, ref) => {
    const [address, setAddress] = useState("");
    const showClearBtn = address.length > 0;

    return (
      <InputGroup disabled size="lg">
        <InputLeftElement children={<FeatherWallet size="1.2em" />} />
        <Input
          id="address"
          variant="outline"
          colorScheme="primary.200"
          rounded="full"
          fontSize="md"
          value={address}
          onInput={(e: any) => setAddress(e.target.value)}
          ref={ref}
          {...props}
        />
        <InputRightElement hidden={!showClearBtn}>
          <Flex alignItems="center">
            <CloseButton rounded="full" onClick={() => setAddress("")} />
          </Flex>
        </InputRightElement>
      </InputGroup>
    );
  }
);

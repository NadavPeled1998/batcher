import {
  Button,
  CloseButton,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  useBoolean,
} from "@chakra-ui/react";
import React, { forwardRef, useState } from "react";
import { UserPlus } from "react-feather";
import { useToggle } from "react-use";
import { FeatherWallet } from "../assets/FeatherWallet";
import { isValidAddress } from "../utils/address";

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
          // bg="gray.800"
          rounded="full"
          value={address}
          onInput={(e: any) => setAddress(e.target.value)}
          ref={ref}
          {...props}
        />
        <InputRightElement>
          <Flex alignItems="center">
            {showClearBtn && <CloseButton onClick={() => setAddress("")} />}
          </Flex>
        </InputRightElement>
      </InputGroup>
    );
  }
);

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

    const [on, set] = useBoolean(false);
    const showClearBtn = address.length > 0;
    const isValid = isValidAddress(address);

    return (
      <InputGroup disabled>
        <InputLeftElement
          px={0}
          w="24px"
          children={<FeatherWallet size="1.2em" />}
        />
        <Input
          id="address"
          variant="flushed"
          colorScheme="primary.200"
          value={address}
          onInput={(e: any) => setAddress(e.target.value)}
          ref={ref}
          {...props}
        />
        <InputRightElement>
          <Flex alignItems="center">
            {showClearBtn && <CloseButton onClick={() => setAddress("")} />}
            {/* {isValid && (
              <Button variant="ghost" size="sm">
                <UserPlus size="1em"/>
              </Button>
            )} */}
          </Flex>
        </InputRightElement>
      </InputGroup>
    );
  }
);

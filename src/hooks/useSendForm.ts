import { Input } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { createRef, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import NumberFormat, {
  NumberFormatProps,
  NumberFormatValues,
} from "react-number-format";
import * as yup from "yup";
import { AddressInput } from "../components/AddressInput";
import { TokenAmountInput } from "../components/TokenAmountInput";
import { TokenPicker } from "../components/TokenPicker/TokenPicker";
import { store } from "../store";
import { isValidAddress } from "../utils/address";
import { Token } from "./useERC20Balance";

type Inputs = {
  address: string;
  amount: number;
  token: Token;
};

const schema = yup
  .object({
    address: yup
      .string()
      .test("is-valid-address", "Invalid address", isValidAddress),
    amount: yup.number().required().positive(),
  })
  .required();

export const useSendForm = () => {
  const addressRef = useRef<any>();
  const amountRef = useRef();

  const addressController: React.ComponentProps<typeof AddressInput> = {
    ref: addressRef,
    value: store.form.address.value,
  };

  const amountController: React.ComponentProps<typeof TokenAmountInput> = {
    ref: amountRef,
    value: store.form.amount.value,
    onValueChange: ({ value }) => {
      store.form.setAmount(value);
    },
  };

  const tokenController: React.ComponentProps<typeof TokenPicker> = {
    value: store.form.tokenPicker.value,
    onChange: (token) => store.form.setToken(token),
  };

  const submit = () => {};

  return {
    amountController,
    addressController,
    tokenController,
    submit,
    formState: {
      errors: {} as {
        address?: { message: string };
        amount?: { message: string };
      },
    },
  };
};

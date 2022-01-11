import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { NumberFormatValues } from "react-number-format";
import * as yup from "yup";
import { store } from "../store";
import { isValidAddress } from "../utils/address";
import { Token, useNativeToken } from "./useERC20Balance";

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
    token: yup.object().required(),
  })
  .required();

export const useSendForm = () => {
  const { nativeToken } = useNativeToken();
  const { setValue, register, ...form } = useForm<Inputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      address: "",
      amount: 0,
      token: nativeToken,
    },
  });

  const addressController = useMemo(() => register("address"), [register]);

  const amountController = useMemo(() => {
    const {  onBlur, ...rest } = register("amount");
    return {
      ...rest,
      onValueChange: ({ floatValue }: NumberFormatValues) => {
        setValue("amount", floatValue || 0);
      },
    };
  }, [register, setValue]);

  const tokenController = useMemo(
    () => ({
      ...register("token"),
      onChange: (token: Token) =>
        setValue("token", token, { shouldValidate: true }),
    }),
    [register, setValue]
  );

  const submit = form.handleSubmit(({ address, amount, token }) => {
    store.batch.add({
      address,
      amount,
      token,
    });
  });

  return {
    ...form,
    register,
    setValue,
    amountController,
    addressController,
    tokenController,
    submit,
  };
};

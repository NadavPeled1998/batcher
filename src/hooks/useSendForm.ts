import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { NumberFormatValues } from "react-number-format";
import * as yup from "yup";
import { isValidAddress } from "../utils/address";

type Inputs = {
  address: string;
  amount: number;
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
  const { setValue, ...form } = useForm<Inputs>({
    resolver: yupResolver(schema),
  });

  const setAmount = useCallback(
    ({ value }: NumberFormatValues) =>
      setValue("amount", Number(value), { shouldDirty: true }),
    [setValue]
  );

  return { ...form, setValue, setAmount };
};

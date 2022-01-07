import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
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
    amount: yup.number().positive(),
  })
  .required();

export const useSendForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
  });

  return {
    register,
    handleSubmit,
    errors,
  };
};

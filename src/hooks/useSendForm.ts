import React, { FormEvent, useEffect, useRef } from "react";
import * as yup from "yup";
import { AddressInput } from "../components/AddressInput";
import { TokenAmountInput } from "../components/TokenAmountInput";
import { TokenPicker } from "../components/TokenPicker/TokenPicker";
import { store } from "../store";
import { isValidAddress } from "../utils/address";

const schema = yup
  .object({
    address: yup
      .string()
      .test("is-valid-address", "Invalid address", isValidAddress),
    amount: yup.number().required().positive().default(0),
  })
  .required();

type ErrorShape = {
  address?: { message: string };
  amount?: { message: string };
};

const createErrors = (errors: any) => {
  return errors.inner.reduce((acc: any, err: any) => {
    if (!acc[err.path]) acc[err.path] = {};
    acc[err.path].message = err.message;
    return acc;
  }, {} as ReturnType<typeof schema.validate>);
};

export const useSendForm = () => {
  const [errors, setErrors] = React.useState<ErrorShape>({});
  const submitCount = useRef(0);
  const addressRef = useRef<any>();
  const amountRef = useRef<any>();

  const addressController: React.ComponentProps<typeof AddressInput> = {
    ref: addressRef,
    value: store.form.address.value,
    onChange: (e: FormEvent<HTMLInputElement>) => {
      store.form.setAddress(e.currentTarget.value);
    },
    clear: () => {
      store.form.setAddress("");
    },
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

  const focusInput = (shapedErrors: ErrorShape) => {
    if (shapedErrors.address) {
      addressRef.current.focus();
    } else if (shapedErrors.amount) {
      amountRef.current.focus();
    }
  };

  const validate = () => {
    return schema
      .validate(
        {
          address: store.form.address.value,
          amount: store.form.amount.value || 0,
        },
        { abortEarly: false }
      )
      .then(() => {
        setErrors({});
      })
      .catch((errors) => {
        const shapedErrors = createErrors(errors);
        focusInput(shapedErrors);
        setErrors(shapedErrors);
        return errors;
      });
  };

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    submitCount.current++;
    const errs = await validate();
    if (errs) return;

    submitCount.current = 0;
    setErrors({});
    store.form.submit();
  };

  useEffect(() => {
    if (submitCount.current > 0) {
      validate();
    }
  }, [amountController.value, addressController.value]);

  return {
    amountController,
    addressController,
    tokenController,
    submit,
    formState: {
      errors,
    },
  };
};

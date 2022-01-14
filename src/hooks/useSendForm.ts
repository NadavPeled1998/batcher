import React, { FormEvent, useEffect, useRef } from "react";
import * as yup from "yup";
import { AddressInput } from "../components/AddressInput";
import { TokenAmountInput } from "../components/TokenAmountInput";
import { TokenPicker } from "../components/TokenPicker/TokenPicker";
import { store } from "../store";
import { isValidAddress } from "../utils/address";
import { useMoralis } from "react-moralis";
import multiSendABI from '../abi/multiSend.json'
import { etherToWei } from "../utils/ethereum";

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
  const { web3, account, chainId } = useMoralis() 

  const schema = yup
  .object({
    address: yup
      .string()
      .test("is-valid-address", "Invalid address", isValidAddress),
    amount: yup
      .number()
      .required()
      .positive()
      .default(0)
    ,
  })
  .required();

  const addressController: React.ComponentProps<typeof AddressInput> = {
    ref: addressRef,
    value: store.form.address,
    onChange: (e: FormEvent<HTMLInputElement>) => {
      store.form.setAddress(e.currentTarget.value);
    },
    clear: () => {
      store.form.setAddress("");
    },
  };

  const amountController: React.ComponentProps<typeof TokenAmountInput> = {
    ref: amountRef,
    value: store.form.amount,
    onValueChange: ({ value }) => {
      store.form.setAmount(value);
    },
  };

  const tokenController: React.ComponentProps<typeof TokenPicker> = {
    value: store.form.tokenPicker,
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
          address: store.form.address,
          amount: store.form.amount || 0,
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
    store.form.reset()
  };

  const sendTransaction = async () => {
    if(web3) {
      const multiSendContract = new web3.eth.Contract(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        multiSendABI as any,
        "0xa679356125A6d1EE8807904adF72ef3BDa2f9aD9",
      )
      let isSendERC20 = false
      let isSendERC721 = false
      let isSendNative = false
      let receivers: string[] = []
      let amounts: string[] = []
      let addresses: string[] = []
      let types: string[] = [] 
      let value = ''

      store.batch.items.map(item => {
        // push to receivers
        receivers.push(item.address)

        // push to amounts
        if(item.token.type === 'erc721') {
          isSendERC721 = true
          amounts.push(String(item.amount))
        } 
        else {
          amounts.push(etherToWei(web3, item.amount, item.token.decimals))
        }

        // push to addresses
        if(item.token.type === 'native') {
          isSendNative = true
          value = String(+value + +etherToWei(web3, item.amount, item.token.decimals))
          addresses.push("0x0000000000000000000000000000000000000000")
        }
        else {
          addresses.push(item.token.token_address)
        }

        if(item.token.type === 'erc20') {
          isSendERC20 = true
        }
        // push to types
        if(item.token.type) {
          types.push(item.token.type)
        }
      })

      console.log("SendTransaction 0", {isSendERC721, isSendERC20, receivers, amounts, addresses} )

      const getMethodWithParams = () => {
        if(isSendERC721 && isSendERC20) {
          return multiSendContract.methods.multiSendAll(receivers, amounts, addresses, types)
        }
        if(isSendNative) {
          if(isSendERC721) {
            return multiSendContract.methods.multiSendNativeAndERC721(receivers, amounts, addresses)
          }
          if(isSendERC20) {
            return multiSendContract.methods.multiSendNativeAndERC20(receivers, amounts, addresses)
          }
          return multiSendContract.methods.multiSendNative(receivers, amounts) 
        }
        if(isSendERC20) {
          return multiSendContract.methods.multiSendERC20(receivers, amounts, addresses) 
        }
        if(isSendERC721) {
          return multiSendContract.methods.multiSendERC721(receivers, amounts, addresses) 
        }
      }
      let methodWithParams = getMethodWithParams()
      console.log("SendTransaction 1", { methodWithParams })
      const { toBN } = web3.utils
      let gas = "1000000"
      try {
        gas = toBN(await methodWithParams.estimateGas({ from: account, value }))
        .mul(toBN(11))
        .div(toBN(10))
        .toString()
      }
      catch(e) {
        console.log("SendTransaction 1.5 checl gas failed", {e})
        gas = "1000000"
      }

      console.log("SendTransaction 2", gas)

      const txid = await new Promise((resolve, reject) => {
        methodWithParams
        .send({ from: account, value, gas  })
        .on('transactionHash', (hash: string) => resolve(hash))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .on('error', (err: any) => reject(err))
      }) 

      alert(txid)   
      console.log("sendTransaction", store.batch.items)

      store.form.reset()
      store.batch.clear()
    }
  }

  useEffect(() => {
    if (submitCount.current > 0) {
      validate();
    }
  }, [amountController.value, addressController.value]);

  useEffect(() => {
    store.form.reset()
    store.batch.clear()
  }, [account, chainId])

  return {
    amountController,
    addressController,
    tokenController,
    submit,
    sendTransaction,
    formState: {
      errors,
    },
  };
};

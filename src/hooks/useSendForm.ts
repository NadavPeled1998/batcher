import React, { FormEvent, useEffect, useRef } from "react";
import * as yup from "yup";
import { AddressInput } from "../components/AddressInput";
import { TokenAmountInput } from "../components/TokenAmountInput";
import { TokenPicker } from "../components/TokenPicker/TokenPicker";
import { store } from "../store";
import { isValidAddress } from "../utils/address";
import { useMoralis } from "react-moralis";
import multiSendABI from "../abi/multiSend.json";
import erc20ABI from "../abi/erc20.json";
import erc721ABI from "../abi/erc721.json";
import { etherToWei } from "../utils/ethereum";
import { Token } from "./useERC20Balance";

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

const MULTI_SEND_CONTRACT_ADDRESS =
  "0xa679356125A6d1EE8807904adF72ef3BDa2f9aD9";

const createErrors = (errors: any) => {
  return errors.inner.reduce((acc: any, err: any) => {
    if (!acc[err.path]) acc[err.path] = {};
    acc[err.path].message = err.message;
    return acc;
  }, {} as ReturnType<typeof schema.validate>);
};

export const useSendForm = () => {
  const [errors, setErrors] = React.useState<ErrorShape>({});
  const [gasFee, setGasFee] =  React.useState<string>('')
  const [externalGasFee, setExternalGasFee] =  React.useState<string>('')
  const submitCount = useRef(0);
  const addressRef = useRef<any>();
  const amountRef = useRef<any>();
  const { web3, account, chainId } = useMoralis();

  const schema = yup
    .object({
      address: yup
        .string()
        .test("is-valid-address", "Invalid address", isValidAddress),
      amount: yup.number().required().positive().default(0),
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
    value: store.form.selectedToken,
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

  const getParams = () => {
    let isSendERC20 = false;
    let isSendERC721 = false;
    let isSendNative = false;
    let receivers: string[] = [];
    let amounts: string[] = [];
    let addresses: string[] = [];
    let types: string[] = [];
    let value = "";

    if(web3) {
      store.batch.items.forEach((item) => {
        // push to receivers
        receivers.push(item.address);
  
        // push to amounts
        if (item.token.type === "erc721") {
          isSendERC721 = true;
          amounts.push(String(item.amount));
        } else {
          amounts.push(etherToWei(web3, item.amount, item.token.decimals));
        }
  
        // push to addresses
        if (item.token.type === "native") {
          isSendNative = true;
          value = String(+value + +etherToWei(web3, item.amount, item.token.decimals));
          addresses.push("0x0000000000000000000000000000000000000000");
        } else {
          addresses.push(item.token.token_address);
        }
  
        if (item.token.type === "erc20") {
          isSendERC20 = true;
        }
        // push to types
        if (item.token.type) {
          types.push(item.token.type);
        }
      });
    }
    return {
      isSendERC20, isSendERC721, isSendNative, receivers, amounts, addresses, types, value
    }
  }

  const getMethodWithParamsAndSendPayload: () => {methodWithParams: any, sendPayload: any} = () => {
    const { isSendERC20, isSendERC721, isSendNative, receivers, amounts, addresses, types, value } = getParams()
    if(web3) {
      const multiSendContract = new web3.eth.Contract(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        multiSendABI as any,
        "0xa679356125A6d1EE8807904adF72ef3BDa2f9aD9"
      );
      if(isSendERC721 && isSendERC20) {
        return {
          methodWithParams: multiSendContract.methods.multiSendAll(
            receivers,
            amounts,
            addresses,
            types
          ), 
          sendPayload: { value }
        }
      }
      if (isSendNative) {
        if (isSendERC721) {
          return {
            methodWithParams: multiSendContract.methods.multiSendNativeAndERC721(
            receivers,
            amounts,
            addresses
            ), 
            sendPayload: { value }
          }
        }
        if (isSendERC20) {
          return {
            methodWithParams: multiSendContract.methods.multiSendNativeAndERC20(
              receivers,
              amounts,
              addresses
            ), 
            sendPayload: { value }
          }
        }
        return {
          methodWithParams: multiSendContract.methods.multiSendNative(receivers, amounts), 
          sendPayload: { value }
        }
      }
      if (isSendERC20) {
        return {
          methodWithParams: multiSendContract.methods.multiSendERC20(
            receivers,
            amounts,
            addresses
          ), 
          sendPayload: { value }
        }
      }
      if (isSendERC721) {
        return {
          methodWithParams: multiSendContract.methods.multiSendERC721(
            receivers,
            amounts,
            addresses
          ), 
          sendPayload: { value }
        }
      }
    }
    return {
      methodWithParams: {}, 
      sendPayload: { value }
    }
  };

  const getGasLimit = async({ methodWithParams, value } : {methodWithParams: any, value: string}) => {
    let gas = "1000000";
    if(web3) {
      const { toBN } = web3.utils;
      try {
        gas = toBN(await methodWithParams.estimateGas({ from: account, value }))
          .mul(toBN(11))
          .div(toBN(10))
          .toString();
      } catch (e) {
        gas = "1000000";
      } 
    }
    return gas
  }

 const getExternalGasLimit = async () => {
  let gasLimit = 0
  if(web3) {
    for(let i = 0; i < store.batch.items.length; i++) {
      const { token, address } = store.batch.items[i]
      if(token.type === 'native') {
        gasLimit += 21000
      }
      else if(token.type === 'erc20') {
        const erc20Contract = new web3.eth.Contract(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          erc20ABI as any,
          token.token_address
        );
        try {
          console.log("blalance")
          const balance = await erc20Contract.methods.balanceOf(address).call()
          console.log({balance})
          if(+balance) {
            gasLimit += 37000
          }
          else {
            gasLimit += 54000
  
          }
        }
        catch {
          console.log("catch failed")
          gasLimit += 37000
        }

      }
      else if(token.type === 'erc721') {
        const erc20Contract = new web3.eth.Contract(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          erc721ABI as any,
          token.token_address
        );
        try {
          const balance = await erc20Contract.methods.balanceOf(address).call()
          if(+balance) {
            gasLimit += 41500
          }
          else {
            gasLimit += 63500
          }
        }
        catch {
          gasLimit += 41500
        }
      }
    };
  }
  return String(gasLimit)
 }

 const calculateGasFeeByGasLimit = async (gasLimit: string) => {
  let gasFee = ''
  if(web3) {
    const { toBN } = web3.utils;
    const gasPrice = await web3.eth.getGasPrice()
    console.log("gasPrice", {gasPrice})
    gasFee = toBN(gasPrice)
      .mul(toBN(gasLimit))
      .toString();
  }
  return gasFee
 }

 const getExternalGasFee = async () => {
  const gasLimit = await getExternalGasLimit()
  const gasFee = await calculateGasFeeByGasLimit(gasLimit)
  console.log("getExternalGasFee", {gasFee, gasLimit})
  return gasFee
 }

  const getGasFee = async () => {
    let { methodWithParams, sendPayload } = getMethodWithParamsAndSendPayload();
    const gasLimit = await getGasLimit({ methodWithParams, value: sendPayload.value});
    const gasFee = await calculateGasFeeByGasLimit(gasLimit)
    console.log("getGasFee", {gasFee, gasLimit})
    return gasFee
  }

  const checkIfNeedApprove = async (token: Token, amount?: string) => {
    if (web3) {
      const { setApproveToken, addToNeedsApproveMap, totals } = store.batch;
      console.log("batch", store.batch);
      if (token.type === "erc20") {
        const erc20Contract = new web3.eth.Contract(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          erc20ABI as any,
          token.token_address
        );
        const allowance = await erc20Contract.methods
          .allowance(account, MULTI_SEND_CONTRACT_ADDRESS)
          .call();

        const total =
          (totals[token.symbol]?.total || 0) + (Number(amount) || 0);
        console.log("checkIfNeedApprove", { total, allowance });
        if (+allowance < +etherToWei(web3, total, token.decimals)) {
          addToNeedsApproveMap(token.token_address, token);
        } else {
          setApproveToken(token.token_address);
        }
      }
      if (token.type === "erc721") {
        const erc721Contract = new web3.eth.Contract(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          erc721ABI as any,
          token.token_address
        );
        const isApprovedForAll = await erc721Contract.methods
          .isApprovedForAll(account, MULTI_SEND_CONTRACT_ADDRESS)
          .call();

        if (!isApprovedForAll) {
          addToNeedsApproveMap(token.token_address, token);
        } else {
          setApproveToken(token.token_address);
        }
      }
    }
  };

  useEffect(() => {
    ;(async function setGasFees() {
      let gasFee = ''
      let externalGasFee = ''
      if(store.batch.itemsLength) {
        gasFee = await getGasFee();
        externalGasFee = await getExternalGasFee();
      }
      setGasFee(gasFee)
      console.log("externalGasFee", {externalGasFee})
      setExternalGasFee(externalGasFee)
    })()
    }, [store.batch.itemsLength])

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    submitCount.current++;
    const errs = await validate();
    if (errs) return;
    if (web3) {
      const token = store.form.selectedToken;
      checkIfNeedApprove(token, String(store.form.amount));
    }
    submitCount.current = 0;
    setErrors({});
    store.form.submit();
    store.form.reset();
  };

  const approveAll = async () => {
    const { needsApproveMap, setApproveToken } = store.batch;
    const { approveCommand } = store.commands;
    approveCommand.setRunning();
    if (web3) {
      Object.values(needsApproveMap).map((token) => {
        if (token.type === "erc20") {
          const erc20Contract = new web3.eth.Contract(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            erc20ABI as any,
            token.token_address
          );
          erc20Contract.methods
            .approve(
              "0xa679356125A6d1EE8807904adF72ef3BDa2f9aD9",
              "115792089237316195423570985008687907853269984665640564039457584007913129639935"
            )
            .send({ from: account })
            .on("receipt", (receipt: any) => {
              if (receipt.status) {
                setApproveToken(token.token_address);
              }
            })
            .on("error", () => {
              approveCommand.setFailed();
            });
        }
        if (token.type === "erc721") {
          const erc721Contract = new web3.eth.Contract(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            erc721ABI as any,
            token.token_address
          );
          erc721Contract.methods
            .setApprovalForAll(
              "0xa679356125A6d1EE8807904adF72ef3BDa2f9aD9",
              true
            )
            .send({ from: account })
            .on("receipt", (receipt: any) => {
              if (receipt.status) {
                setApproveToken(token.token_address);
              }
            })
            .on("error", () => {
              approveCommand.setFailed();
            });
        }
      });
    }
  };

  useEffect(() => {
    if (!store.batch.isNeedsApprove && store.commands.approveCommand.running) {
      store.commands.approveCommand.setDone();
    }
  }, [store.commands.approveCommand.running, store.batch.isNeedsApprove]);

  const sendTransaction = async () => {
    if (web3) {
      let { methodWithParams, sendPayload } = getMethodWithParamsAndSendPayload();
      const gas = getGasLimit({ methodWithParams, value: sendPayload.value});

      await new Promise((resolve, reject) => {
        methodWithParams
          .send({ from: account, ...sendPayload, gas })
          .on("transactionHash", (hash: string) => resolve(hash))
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .on("error", (err: any) => reject(err));
      });

      store.form.reset();
      store.batch.clear();
    }
  };

  useEffect(() => {
    if (submitCount.current > 0) {
      validate();
    }
  }, [amountController.value, addressController.value]);

  useEffect(() => {
    store.form.reset();
    store.batch.clear();
  }, [account, chainId]);

  return {
    amountController,
    addressController,
    tokenController,
    submit,
    sendTransaction,
    approveAll,
    gasFee,
    externalGasFee,
    formState: {
      errors,
    },
  };
};

import React, { FormEvent, useEffect, useRef } from "react";
import * as yup from "yup";
import { AddressInput } from "../components/AddressInput";
import { TokenAmountInput } from "../components/TokenAmountInput";
import { TokenPicker } from "../components/TokenPicker/TokenPicker";
import { NFTPicker } from "../components/NFTPicker/NFTPicker";
import { store } from "../store";
import { isValidAddress } from "../utils/address";
import { useMoralis } from "react-moralis";
import { Token } from "./useERC20Balance";
import { AssetType } from "../store/form";
import { NFT } from "../store/nfts";
import { calculateGasFeeByGasLimit, getExternalGasLimit, getGasLimit } from "../utils/gas";
import { getMethodWithParamsAndSendPayload } from "../utils/methods";
import { approveAsset, checkIfNeedApprove } from "../utils/allowance";

const schema = yup
  .object({
    address: yup
      .string()
      .test("is-valid-address", "Invalid address", isValidAddress),
    ...(store.form.assetType === AssetType.Token && {
      amount: yup.number().required().positive().default(0),
    }),
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
  const [gasFee, setGasFee] = React.useState<string>("");
  const [externalGasFee, setExternalGasFee] = React.useState<string>("");
  const submitCount = useRef(0);
  const addressRef = useRef<any>();
  const amountRef = useRef<any>();
  const { web3, account, chainId } = useMoralis();

  const schema = yup
    .object({
      address: yup
        .string()
        .test("is-valid-address", "Invalid address", isValidAddress),
      ...(store.form.assetType === AssetType.Token && {
        amount: yup.number().required().positive().default(0),
      })
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

  const nftController: React.ComponentProps<typeof NFTPicker> = {
    value: store.form.selectedNFT,
    onChange: (nft) => store.form.setNFT(nft),
  };

  useEffect(() => {
    (async function setGasFees() {
      let gasFee = "";
      let externalGasFee = "";
      if (store.batch.itemsLength) {
        gasFee = await getGasFee();
        externalGasFee = await getExternalGasFee();
      }
      setGasFee(gasFee);
      console.log("externalGasFee", { externalGasFee });
      setExternalGasFee(externalGasFee);
    })();
  }, [store.batch.itemsLength]);

  useEffect(() => {
    if (!store.batch.isNeedsApprove && store.commands.approveCommand.running) {
      store.commands.approveCommand.setDone();
    }
  }, [store.commands.approveCommand.running, store.batch.isNeedsApprove]);

  useEffect(() => {
    if (submitCount.current > 0) {
      validate();
    }
  }, [amountController.value, addressController.value]);

  useEffect(() => {
    store.form.reset();
    store.batch.clear();
  }, [account, chainId]);

  const focusInput = (shapedErrors: ErrorShape) => {
    if (shapedErrors.address) {
      addressRef.current.focus();
    } else if (store.form.assetType === AssetType.Token && shapedErrors.amount) {
      amountRef.current?.focus();
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

  const getExternalGasFee = async () => {
    const gasLimit = await getExternalGasLimit(web3);
    console.log("gasLimit", { gasLimit });
    const gasFee = await calculateGasFeeByGasLimit(web3, gasLimit);
    console.log("getExternalGasFee", { gasFee, gasLimit });
    return gasFee;
  };

  const getGasFee = async () => {
    let { methodWithParams, sendPayload } = getMethodWithParamsAndSendPayload(web3)
    const gasLimit = await getGasLimit({
      web3,
      account,
      methodWithParams,
      value: sendPayload.value,
    });
    const gasFee = await calculateGasFeeByGasLimit(web3, gasLimit);
    console.log("getGasFee", { gasFee, gasLimit });
    return gasFee;
  };

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    submitCount.current++;
    const errs = await validate();
    if (errs) return;
    if (web3) {
      const token = store.form.assetType === AssetType.Token ? (store.form.selectedToken as Token) : (store.form.selectedNFT as NFT)
      checkIfNeedApprove(web3, account, token, String(store.form.amount));
    }
    submitCount.current = 0;
    setErrors({});
    store.form.submit();
    store.form.reset();
  };

  const approveAll = () => {
    const { needsApproveMap, setApproveToken } = store.batch;
    const { approveCommand } = store.commands;
    approveCommand.setRunning();
    Object.values(needsApproveMap).map((token) => approveAsset(web3, account, token));
  }

  const sendTransaction = async () => {
    if (web3) {
      let { methodWithParams, sendPayload } = getMethodWithParamsAndSendPayload(web3);
      let gas = '1000000'
      try {
        gas = await getGasLimit({
          web3,
          account,
          methodWithParams,
          value: sendPayload.value,
        })
      }
      catch (err) {
        gas = '1000000'
      }

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

  return {
    amountController,
    addressController,
    tokenController,
    nftController,
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

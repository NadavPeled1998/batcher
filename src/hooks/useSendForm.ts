import React, { FormEvent, useEffect, useRef } from "react";
import * as yup from "yup";
import { AddressInput } from "../components/AddressInput";
import { InputType, TokenAmountInput } from "../components/TokenAmountInput";
import { TokenPicker } from "../components/TokenPicker/TokenPicker";
import { NFTPicker } from "../components/NFTPicker/NFTPicker";
import { store } from "../store";
import { isValidAddress } from "../utils/address";
import { useMoralis } from "react-moralis";
import { AssetType } from "../store/form";
import {
  calculateGasFeeByGasLimit,
  getEstimatedGasLimit,
  getExternalGasLimit,
  getGasLimit,
} from "../utils/gas";
import { getMethodWithParamsAndSendPayload, getParams } from "../utils/methods";
import { approveAsset, checkIfNeedApprove } from "../utils/allowance";
import { Transaction } from '../store/history'
import { MULTI_SEND_CONTRACT_ADDRESSES } from "../utils/multiSendContractAddress";
import { useNavigate } from 'react-location'
import { etherToWei } from "../utils/ethereum";
import { NFT } from "../store/nfts";
import { Token } from "../store/prices";

const schema = yup
  .object({
    address: yup
      .string()
      .test("is-different-address", "You can't send to yourself", function (value) {
        return value?.toLocaleLowerCase() !== 'account'?.toLocaleLowerCase()
      })
      .test("is-valid-address", "Invalid address", isValidAddress),
    ...(store.form.assetType === AssetType.Token && {
      amount: yup
      .number()
      .required()
      .positive()
      .test("is-enough-balance", `You don't have enough balance`, function (value) {
        return true
      })
      .default(0),
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
  const navigate = useNavigate();

  const schema = yup
    .object({
      address: yup
        .string()
        .required()
        .test("is-different-address", "You can't send to yourself", function (value) {
          return value?.toLocaleLowerCase() !== account?.toLocaleLowerCase()
        })
        .test("is-valid-address", "Invalid address", isValidAddress),
      ...(store.form.assetType === AssetType.Token && {
        amount: yup
          .number()
          .required()
          .positive()
          .test("is-enough-balance", `You don't have enough ${store.form.selectedToken.symbol}`, function (value) {
            if(web3) {
              const amount = store.form.amountInputType === InputType.Token ? value : store.form._amount
              const total = etherToWei(web3, Number(store.batch.totals[store.form.selectedToken.symbol]?.total || '0') + Number(amount || '0'), store.form.selectedToken.decimals)
              return Number(total) <= Number(store.form.selectedToken.balance) 
            }
            return true
          })
          .default(0),
      }),
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
    value: store.form.selectedNFTs,
    onChange: (nfts) => store.form.setNFTs(nfts),
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

  const focusInput = (shapedErrors: ErrorShape) => {
    if (shapedErrors.address) {
      addressRef.current.focus();
    } else if (
      store.form.assetType === AssetType.Token &&
      shapedErrors.amount
    ) {
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
    const gasFee = await calculateGasFeeByGasLimit(web3, gasLimit);
    return gasFee;
  };

  const getGasFee = async () => {
    const multiSendContractAddress = MULTI_SEND_CONTRACT_ADDRESSES[chainId as string]
    let { methodWithParams, sendPayload } = getMethodWithParamsAndSendPayload(web3, multiSendContractAddress)
    let gasLimit = ''
    try {
      gasLimit = await getGasLimit({
        web3,
        account,
        methodWithParams,
        value: sendPayload.value,
      });
    }
    catch {
      const params = getParams(web3)
      gasLimit = await getEstimatedGasLimit(web3, params)
    }
    const gasFee = await calculateGasFeeByGasLimit(web3, gasLimit);
    return gasFee;
  };

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    submitCount.current++;
    const errs = await validate();
    if (errs) return;
    if (web3) {
      const tokens =
        (store.form.assetType === AssetType.Token
          ? [store.form.selectedToken]
          : store.form.selectedNFTs) || [];

      tokens.forEach(async (token: Token | NFT) => {
        checkIfNeedApprove(web3, account, chainId, token, String(store.form.amount));
      });
    }
    submitCount.current = 0;
    setErrors({});
    store.form.submit();
    store.form.reset();
  };

  const approveAll = () => {
    const { needsApproveMap } = store.batch;
    const { approveCommand } = store.commands;
    approveCommand.setRunning();
    Object.values(needsApproveMap).map((token) =>
      approveAsset(web3, account, token, MULTI_SEND_CONTRACT_ADDRESSES[chainId as string])
    );
  };

  const sendTransaction = async () => {
    if (web3) {
      const multiSendContractAddress = MULTI_SEND_CONTRACT_ADDRESSES[chainId as string]
      let { methodWithParams, sendPayload } = getMethodWithParamsAndSendPayload(web3, multiSendContractAddress);
      let gas = "1000000";
      try {
        gas = await getGasLimit({
          web3,
          account,
          methodWithParams,
          value: sendPayload.value,
        });
      } catch (err) {
        gas = "1000000";
      }

      const input = methodWithParams.encodeABI()

      await new Promise((resolve, reject) => {
        methodWithParams
          .send({ from: account, ...sendPayload, gas })
          .on("transactionHash", (hash: string) => {
            // add here a transaction to the pending
            const transaction: Transaction = { 
              hash,
              nonce: '',
              transaction_index: '',
              from_address: account || '',
              to_address: MULTI_SEND_CONTRACT_ADDRESSES[chainId as string],
              value: sendPayload.value,
              gas,
              gas_price: '',
              input,
              receipt_cumulative_gas_used: '',
              receipt_gas_used: '',
              receipt_contract_address: '',
              receipt_root: '',
              receipt_status: '',
              block_timestamp: new Date().toISOString(),
              block_number: '',
              block_hash: '',
            }
            store.history.addTransaction(transaction)
            navigate({to: '/history'})
            return resolve(hash)
          })
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

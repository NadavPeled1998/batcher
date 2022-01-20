import MoralisType from "moralis";
import { store } from "../store";
import { NFT } from "../store/nfts";
import { etherToWei } from "./ethereum";
import multiSendABI from '../abi/multiSend.json'

export const getParams = (web3: MoralisType.Web3 | null) => {
    let isSendERC20 = false;
    let isSendERC721 = false;
    let isSendNative = false;
    let receivers: string[] = [];
    let amounts: string[] = [];
    let addresses: string[] = [];
    let types: string[] = [];
    let value = "";

    if (web3) {
        store.batch.items.forEach((item) => {
            // push to receivers
            receivers.push(item.address);

            // push to amounts
            if (item.token.type === "erc721") {
                isSendERC721 = true;
                amounts.push((item.token as NFT).id);
            } else {
                amounts.push(etherToWei(web3, item.amount, item.token.decimals));
            }

            // push to addresses
            if (item.token.type === "native") {
                isSendNative = true;
                value = String(
                    +value + +etherToWei(web3, item.amount, item.token.decimals)
                );
                addresses.push("0x0000000000000000000000000000000000000000");
            } else {
                addresses.push(item.token.address);
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
        isSendERC20,
        isSendERC721,
        isSendNative,
        receivers,
        amounts,
        addresses,
        types,
        value,
    };
};

export const getMethodWithParamsAndSendPayload: (web3: MoralisType.Web3 | null) => {
    methodWithParams: any;
    sendPayload: any;
} = (web3) => {
    const {
        isSendERC20,
        isSendERC721,
        isSendNative,
        receivers,
        amounts,
        addresses,
        types,
        value,
    } = getParams(web3);
    if (web3) {
        const multiSendContract = new web3.eth.Contract(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            multiSendABI as any,
            "0xa679356125A6d1EE8807904adF72ef3BDa2f9aD9"
        );
        if (isSendERC721 && isSendERC20) {
            return {
                methodWithParams: multiSendContract.methods.multiSendAll(
                    receivers,
                    amounts,
                    addresses,
                    types
                ),
                sendPayload: { value },
            };
        }
        if (isSendNative) {
            if (isSendERC721) {
                return {
                    methodWithParams:
                        multiSendContract.methods.multiSendNativeAndERC721(
                            receivers,
                            amounts,
                            addresses
                        ),
                    sendPayload: { value },
                };
            }
            if (isSendERC20) {
                return {
                    methodWithParams: multiSendContract.methods.multiSendNativeAndERC20(
                        receivers,
                        amounts,
                        addresses
                    ),
                    sendPayload: { value },
                };
            }
            return {
                methodWithParams: multiSendContract.methods.multiSendNative(
                    receivers,
                    amounts
                ),
                sendPayload: { value },
            };
        }
        if (isSendERC20) {
            return {
                methodWithParams: multiSendContract.methods.multiSendERC20(
                    receivers,
                    amounts,
                    addresses
                ),
                sendPayload: { value },
            };
        }
        if (isSendERC721) {
            return {
                methodWithParams: multiSendContract.methods.multiSendERC721(
                    receivers,
                    amounts,
                    addresses
                ),
                sendPayload: { value },
            };
        }
    }
    return {
        methodWithParams: {},
        sendPayload: { value },
    };
};
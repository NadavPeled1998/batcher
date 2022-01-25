import MoralisType from "moralis";
import { store } from "../store";
import erc20ABI from '../abi/erc20.json'
import erc721ABI from '../abi/erc721.json'
import { createERC20Contract, createERC721Contract } from "../contracts";

export const getEstimatedGasLimit = async (web3: MoralisType.Web3 | null, params: any) => {

    const { isSendERC20, isSendERC721, isSendNative } = params

    let gasLimit = 0;
    let existNative = 0
    let unExistNative = 0
    let firstTokenAddition = 0;
    let existToken = 0
    let unExistToken = 0
    let firstNFTAddition = 0;
    let existNFT = 0
    let unExistNFT = 0
    let isThereToken = false;
    let isThereNFT = false;

    if (isSendERC20) {
        if (isSendERC721) {
            gasLimit = 26000
            existNative = 13000
            unExistNative = 38000
            firstTokenAddition = 14000
            existToken = 16000
            unExistToken = 33000
            firstNFTAddition = 9000
            existNFT = 25500
            unExistNFT = 42500
        }
        else if (isSendNative) {
            gasLimit = 24000
            existNative = 11000
            unExistNative = 36000
            firstTokenAddition = 14000
            existToken = 14500
            unExistToken = 31500
        }
        else {
            gasLimit = 39000
            existToken = 12000
            unExistToken = 30000
        }
    }
    else if (isSendERC721) {
        if (isSendNative) {
            gasLimit = 24000
            existNative = 11000
            unExistNative = 36000
            firstNFTAddition = 19000
            existNFT = 23500
            unExistNFT = 40500
        }
        else {
            gasLimit = 33000
            existNFT = 23500
            unExistNFT = 40500
        }
    }
    else {
        gasLimit = 23000
        existNative = 10000
        unExistNative = 35000
    }
    if (web3) {
        for (let i = 0; i < store.batch.items.length; i++) {
            const { token, address } = store.batch.items[i];
            if (token.type === "native") {
                const balance = await web3.eth.getBalance(address)
                if (balance) {
                    gasLimit += existNative;
                }
                else {
                    gasLimit += unExistNative;
                }
            } else if (token.type === "erc20") {
                const erc20Contract = new web3.eth.Contract(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    erc20ABI as any,
                    token.address
                );
                console.log("getEstimatedGasLimit 2 erc20", { address: token.address })
                if (!isThereToken) {
                    isThereToken = true
                    gasLimit += firstTokenAddition
                }
                try {
                    const balance = await erc20Contract.methods
                        .balanceOf(address)
                        .call();
                    console.log("getEstimatedGasLimit 3 erc20", { balance })

                    console.log({ balance });
                    if (+balance) {
                        gasLimit += existToken;
                    } else {
                        gasLimit += unExistToken;
                    }
                } catch {
                    gasLimit += existToken;
                }
            } else if (token.type === "erc721") {
                if (!isThereNFT) {
                    isThereNFT = true
                    gasLimit += firstNFTAddition
                }
                const erc721Contract = new web3.eth.Contract(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    erc721ABI as any,
                    token.address
                );
                try {
                    const balance = await erc721Contract.methods
                        .balanceOf(address)
                        .call();
                    if (+balance) {
                        gasLimit += existNFT;
                    } else {
                        gasLimit += unExistNFT;
                    }
                } catch {
                    gasLimit += existNFT;
                }
            }
        }
    }
    return String(gasLimit);
}

export const getGasLimit = async ({
    web3,
    account,
    methodWithParams,
    value,
}: {
    web3: MoralisType.Web3 | null,
    account: string | null,
    methodWithParams: any;
    value: string;
}) => {
    let gas = "1000000";
    if (web3) {
        const { toBN } = web3.utils;
        try {
            gas = toBN(await methodWithParams.estimateGas({ from: account, value }))
                .mul(toBN(105))
                .div(toBN(100))
                .toString();
        }
        catch {
            throw Error
        }
    }
    return gas;
};

export const getExternalGasLimit: (web3: MoralisType.Web3 | null) => Promise<string> = async (web3) => {
    let gasLimit = 0;
    if (web3) {
        for (let i = 0; i < store.batch.items.length; i++) {
            const { token, address } = store.batch.items[i];
            if (token.type === "native") {
                gasLimit += 21000;
            } else if (token.type === "erc20") {
                const erc20Contract = createERC20Contract(web3, token.address);
                try {
                    const balance = await erc20Contract.methods
                        .balanceOf(address)
                        .call();
                    if (+balance) {
                        gasLimit += 37000;
                    } else {
                        gasLimit += 54000;
                    }
                } catch {
                    gasLimit += 37000;
                }
            } else if (token.type === "erc721") {
                const erc721Contract = createERC721Contract(web3, token.address);
                try {
                    const balance = await erc721Contract.methods
                        .balanceOf(address)
                        .call();
                    if (+balance) {
                        gasLimit += 41500;
                    } else {
                        gasLimit += 63500;
                    }
                } catch {
                    gasLimit += 41500;
                }
            }
        }
    }
    return String(gasLimit);
};

export const calculateGasFeeByGasLimit = async (web3: MoralisType.Web3 | null, gasLimit: string) => {
    let gasFee = "";
    if (web3) {
        const { toBN } = web3.utils;
        const gasPrice = await web3.eth.getGasPrice();
        gasFee = toBN(gasPrice).mul(toBN(gasLimit)).toString();
    }
    return gasFee;
};
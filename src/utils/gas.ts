import MoralisType from "moralis";
import { store } from "../store";
import erc20ABI from '../abi/erc20.json'
import erc721ABI from '../abi/erc721.json'


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
                .mul(toBN(11))
                .div(toBN(10))
                .toString();
        } catch (e) {
            gas = "1000000";
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
                const erc20Contract = new web3.eth.Contract(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    erc20ABI as any,
                    token.address
                );
                try {
                    const balance = await erc20Contract.methods
                        .balanceOf(address)
                        .call();
                    console.log({ balance });
                    if (+balance) {
                        gasLimit += 37000;
                    } else {
                        gasLimit += 54000;
                    }
                } catch {
                    gasLimit += 37000;
                }
            } else if (token.type === "erc721") {
                const erc20Contract = new web3.eth.Contract(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    erc721ABI as any,
                    token.address
                );
                try {
                    const balance = await erc20Contract.methods
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

export const calculateGasFeeByGasLimit = async (web3: MoralisType.Web3 | null,gasLimit: string) => {
    let gasFee = "";
    if (web3) {
        const { toBN } = web3.utils;
        const gasPrice = await web3.eth.getGasPrice();
        console.log("gasPrice", { gasPrice });
        gasFee = toBN(gasPrice).mul(toBN(gasLimit)).toString();
    }
    return gasFee;
};
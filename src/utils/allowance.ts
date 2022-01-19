import MoralisType from "moralis";
import { store } from "../store";
import erc20ABI from '../abi/erc20.json'
import erc721ABI from '../abi/erc721.json'
import { Token } from "../hooks/useERC20Balance";
import { NFT } from "../store/nfts";
import { etherToWei } from "./ethereum";


export const checkIfNeedApprove = async (web3: MoralisType.Web3 | null, account: string | null, token: Token | NFT, amount?: string) => {
    const MULTI_SEND_CONTRACT_ADDRESS = process.env.REACT_APP_MULTI_SEND_CONTRACT_ADDRESS
    if (web3) {
        const { setApproveToken, addToNeedsApproveMap, totals } = store.batch;
        console.log("batch", store.batch);
        if (token.type === "erc20") {
            const erc20 = token as Token
            const erc20Contract = new web3.eth.Contract(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                erc20ABI as any,
                erc20.token_address
            );
            const allowance = await erc20Contract.methods
                .allowance(account, MULTI_SEND_CONTRACT_ADDRESS)
                .call();

            const total =
                (totals[erc20.symbol]?.total || 0) + (Number(amount) || 0);
            console.log("checkIfNeedApprove", { total, allowance });
            if (+allowance < +etherToWei(web3, total, erc20.decimals)) {
                addToNeedsApproveMap(erc20.token_address, erc20);
            } else {
                setApproveToken(erc20.token_address);
            }
        }
        if (token.type === "erc721") {
            const erc721 = token as NFT
            const erc721Contract = new web3.eth.Contract(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                erc721ABI as any,
                erc721.token_address
            );
            const isApprovedForAll = await erc721Contract.methods
                .isApprovedForAll(account, MULTI_SEND_CONTRACT_ADDRESS)
                .call();

            if (!isApprovedForAll) {
                addToNeedsApproveMap(erc721.token_address, erc721);
            } else {
                setApproveToken(erc721.token_address);
            }
        }
    }
};

export const approveAsset = (web3: MoralisType.Web3 | null, account: string | null, token: Token | NFT) => {
    const { setApproveToken } = store.batch;
    const { approveCommand } = store.commands
    if(web3) {
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
    }
}
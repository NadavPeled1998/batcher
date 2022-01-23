import Moralis from "moralis";
import ERC20Abi from "../abi/erc20.json";
import ERC721Abi from "../abi/erc721.json";
import MultiSendAbi from "../abi/multiSend.json";
import { ContractContext as ERC20Contract } from "../abi/types/ERC20";
import { ContractContext as ERC721Contract } from "../abi/types/ERC721";
import { ContractContext as MultiSendContract } from "../abi/types/MultiSend";

export const MULTI_SEND_CONTRACT_ADDRESS = process.env
  .REACT_APP_MULTI_SEND_CONTRACT_ADDRESS as string;

export const createContract = <TContract>(
  web3: Moralis.Web3,
  abi: any,
  address: string
) => {
  return new web3.eth.Contract(abi as any, address) as unknown as TContract;
};

export const createMultiSendContract = (web3: Moralis.Web3) => {
  return createContract<MultiSendContract>(
    web3,
    MultiSendAbi,
    MULTI_SEND_CONTRACT_ADDRESS
  );
};

export const createERC20Contract = (web3: Moralis.Web3, address: string) => {
  return createContract<ERC20Contract>(web3, ERC20Abi, address);
};

export const createERC721Contract = (web3: Moralis.Web3, address: string) => {
  return createContract<ERC721Contract>(web3, ERC721Abi, address);
};

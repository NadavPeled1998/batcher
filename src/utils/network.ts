import { ChainID } from "../store/prices";

export const NATIVE_ADDRESS_0xE: string =
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

export const NATIVE_ADDRESS_0x0: string =
  "0x0000000000000000000000000000000000000000";

export const networkConfigs: { [key: string]: any } = {
  "0x4": {
    chainId: 4,
    chainName: "Rinkeby",
    currencySymbol: "ETH",
    blockExplorerUrl: "https://rinkeby.etherscan.io/",
    wrapped: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  },
  "0xa86a": {
    chainId: 43114,
    chainName: "Avalanche Mainnet",
    currencyName: "AVAX",
    currencySymbol: "AVAX",
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    blockExplorerUrl: "https://cchain.explorer.avax.network/",
  },
  "0xa869": {
    chainId: 43113,
    chainName: "Avalanche Fuji Testnet",
    currencyName: "AVAX",
    currencySymbol: "AVAX",
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    blockExplorerUrl: "https://testnet.snowtrace.io/",
  },
};

export const getNativeByChain = (chain: ChainID) =>
  networkConfigs[chain!]?.currencySymbol || "NATIVE";

export const getChainById = (chain: ChainID) =>
  networkConfigs[chain!]?.chainId || null;

export const getExplorer = (chain: ChainID) =>
  networkConfigs[chain!]?.blockExplorerUrl;

export const getWrappedNative = (chain: ChainID) =>
  networkConfigs[chain!]?.wrapped || null;

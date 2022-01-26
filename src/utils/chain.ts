import { ChainID } from "../hooks/useERC20Balance";

type chains = { [key in string]: ChainID };

export const CHAINS: chains = {
    '0x4': 'eth',
    '0xa869': '0xa86a'
}
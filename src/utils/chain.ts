import { ChainID } from "../store/prices";

type chains = { [key in string]: ChainID };

export const CHAINS: chains = {
    '0x4': 'eth',
    '0xa869': '0xa86a',
    '0xa86a': '0xa86a'
}
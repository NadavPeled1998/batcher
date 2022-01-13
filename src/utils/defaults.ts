import { Token } from "../hooks/useERC20Balance";

export const genDefaultETHToken = (): Token => {
  return {
    token_address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    decimals: "18",
    symbol: "ETH",
    name: "Ethereum",
    balance: "0",
    logo: undefined,
    thumbnail: undefined,
    type: "native",
  };
};

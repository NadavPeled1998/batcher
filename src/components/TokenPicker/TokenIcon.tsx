import { FC } from "react";
import { Token } from "../../store/prices";
import { store } from "../../store";
import { TokenMetaData } from "../../store/tokens";
interface TokenIconProps {
  token: TokenMetaData | Token | string;
  size?: string;
}

export const TokenIcon: FC<TokenIconProps> = ({ token, size = "40" }) => {
  const defaultSrc = require(`cryptocurrency-icons/svg/color/generic.svg`).default;
  const symbol = typeof token === "string" ? token : token?.symbol;
  try {
    const iconSrc = require(`cryptocurrency-icons/svg/color/${symbol.toLowerCase()}.svg`).default;
    return <img src={iconSrc} width={size} alt={symbol} />;
  } catch (error) {
    const logo = (token as Token)?.logo || (store.tokens.list.find(item => item.token_address === (token as TokenMetaData)?.address))?.logo
    if(logo) {
      return <img src={logo} width={size} alt={symbol} />;
    }
    return <img src={defaultSrc} width={size} alt={symbol} />;
  }
};

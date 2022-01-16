import { FC } from "react";
import { Token } from "../../hooks/useERC20Balance";
import { TokenMetaData } from "../../store/tokens";
interface TokenIconProps {
  token: TokenMetaData | Token | string;
  size?: string;
}

export const TokenIcon: FC<TokenIconProps> = ({ token, size = "40" }) => {
  const defaultSrc = require(`cryptocurrency-icons/svg/color/eth.svg`).default;
  const symbol = typeof token === "string" ? token : token.symbol;
  try {
    const iconSrc =
      require(`cryptocurrency-icons/svg/color/${symbol.toLowerCase()}.svg`).default;
    return <img src={iconSrc} width={size} alt={symbol} />;
  } catch (error) {
    return <img src={defaultSrc} width={size} alt={symbol} />;
  }
};

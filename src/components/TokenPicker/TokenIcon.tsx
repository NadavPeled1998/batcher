import { FC } from "react";
import { Token } from "../../hooks/useERC20Balance";
interface TokenIconProps {
  token: Token;
  size?: string;
}

export const TokenIcon: FC<TokenIconProps> = ({ token, size = "40" }) => {
  const defaultSrc = require(`cryptocurrency-icons/svg/color/eth.svg`).default;
  try {
    const iconSrc =
      require(`cryptocurrency-icons/svg/color/${token.symbol.toLowerCase()}.svg`).default;
    return <img src={iconSrc} width={size} alt={token.symbol} />;
  } catch (error) {
    return <img src={defaultSrc} width={size} alt={token.symbol} />;
  }
};

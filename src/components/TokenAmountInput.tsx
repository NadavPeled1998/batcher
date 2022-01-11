import { FC, forwardRef } from "react";
import NumberFormat, { NumberFormatProps } from "react-number-format";

export enum InputType {
  Token,
  Fiat,
}
export interface TokenAmountInputProps extends NumberFormatProps<unknown> {
  inputType?: InputType;
}

export const TokenAmountInput = forwardRef<
  NumberFormat<unknown>,
  TokenAmountInputProps
>(({ inputType = InputType.Fiat, ...props }, ref) => {
  const prefix = inputType === InputType.Token ? "" : "$";
  const decimalScale = inputType === InputType.Token ? 6 : 2;

  return (
    <NumberFormat
      {...props}
      getInputRef={ref}
      thousandSeparator={true}
      thousandsGroupStyle="thousand"
      prefix={prefix}
      decimalScale={decimalScale}
    />
  );
});

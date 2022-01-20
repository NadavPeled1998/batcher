import { Text, TextProps } from "@chakra-ui/react";
import { FC } from "react";

export const Ellipsis: FC<TextProps> = (props) => {
  return (
    <Text
      maxW="full"
      overflow="hidden"
      textOverflow="ellipsis"
      wordBreak="keep-all"
      whiteSpace="nowrap"
      {...props}
    />
  );
};

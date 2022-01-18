import { FC } from "react";
import Lottie from "lottie-react";
import animationData from "./arrow-down.json";

export const LottieArrowDown: FC<React.ComponentProps<typeof Lottie>> = (
  props
) => (
  <Lottie
    animationData={animationData}
    loop
    style={{ width: "40px" }}
    {...props}
  />
);

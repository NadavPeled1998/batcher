import React, { forwardRef } from "react";
import { IconProps as FeatherIconProps } from "react-feather";

export const makeFeatherIcon = (
  children: React.ReactNode | React.ReactNode[]
) =>
  forwardRef<SVGSVGElement, FeatherIconProps>(
    ({ color = "currentColor", size = 24, ...rest }, ref) => (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...rest}
      >
        {children}
      </svg>
    )
  );

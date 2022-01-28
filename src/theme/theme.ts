import { extendTheme, ThemeConfig, withDefaultProps } from "@chakra-ui/react";
import { pSBC } from "./pSBC";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

export const createColors = (color: string) => {
  const colors = {
    100: pSBC(0.15, color),
    200: pSBC(0.0, color),
    300: pSBC(-0.15, color),
    400: pSBC(-0.3, color),
    500: pSBC(-0.45, color),
    600: pSBC(-0.6, color),
    700: pSBC(-0.7, color),
    800: pSBC(-0.8, color),
    900: pSBC(-0.9, color),
  };
  return colors;
};

const theme = extendTheme(
  {
    config,
    colors: {
      primary: createColors("#0095FF"),
      // primary: createColors("#FF075D"),
      muted: createColors("#676C77"),
      border: createColors("#343B48"),
    },
    fonts: {
      heading: "Poppins",
      body: "Poppins",
    },
    components: {
      Button: {
        defaultProps: {
          rounded: "full",
        },
      },
    },
  },
  withDefaultProps({
    defaultProps: {
      rounded: "full",
    },
    components: ["Button"],
  })
);

export default theme;

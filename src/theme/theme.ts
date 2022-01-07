import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { pSBC } from "./pSBC";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

// create function to create colors from 100-900
// take a 500 color and create all the rest
// every color under 500 is lighten
// every color over 500 is darken

export const createColors = (color: string) => {
  // the color param should be at position 300
  // create psbc colors from 0.3,

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
console.log(createColors("#FF005C"));
// 3. extend the theme
const theme = extendTheme({
  config,
  colors: {
    primary: createColors("#FF005C"),
    muted: createColors("#676C77"),
    border: createColors("#343B48"),
  },
});

export default theme;

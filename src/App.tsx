import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import { Outlet, ReactLocation, Router } from "react-location";
import { MoralisProvider } from "react-moralis";
import "./App.css";
import { routes } from "./routes";
import theme, { createColors } from "./theme/theme";

// const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL!;
// const appId = process.env.REACT_APP_MORALIS_APP_ID!;

const serverUrl = "https://ruouwmpqomdf.usemoralis.com:2053/server";
const appId = "qsQgM58YEG8yepeo1zEtRTbvdiZ9ln08KXQShHuK";
console.log("appId:", createColors('#fafafa'));

const location = new ReactLocation();
function App() {
  return (
    <ChakraProvider theme={theme}>
      <MoralisProvider appId={appId} serverUrl={serverUrl}>
        <Router location={location} routes={routes}>
          <Outlet />
        </Router>
      </MoralisProvider>
    </ChakraProvider>
  );
}

export default App;

import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import { Outlet, ReactLocation, Router } from "react-location";
import { MoralisProvider } from "react-moralis";
import "./App.css";
import { routes } from "./routes";
import { Fonts } from "./theme/Fonts";
import theme from "./theme/theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./theme/react-toastify.css";
import {
  QueryClient,
  QueryClientProvider,
} from "react-query";

const queryClient = new QueryClient();
// const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL!;
// const appId = process.env.REACT_APP_MORALIS_APP_ID!;
const serverUrl = "https://zbqogacyxxx7.usemoralis.com:2053/server";
const appId = "jKZDa5G9DdnPSzGR4akqUG5pJ6G8Jh9efZWBgT2D";

const location = new ReactLocation();
function App() {
  return (
    <ChakraProvider theme={theme}>
      <Fonts />
      <ToastContainer
        hideProgressBar
        draggablePercent={20}
        theme="dark"
        position="top-center"
        // transition={Slide}
      />
      <QueryClientProvider client={queryClient}>
        <MoralisProvider appId={appId} serverUrl={serverUrl}>
          <Router location={location} routes={routes}>
            <Outlet />
          </Router>
        </MoralisProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;

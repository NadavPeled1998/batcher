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
const serverUrl =  process.env.REACT_APP_MORALIS_SERVER_URL as string;
const appId = process.env.REACT_APP_MORALIS_APP_ID as string;

const location = new ReactLocation();
function App() {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <MoralisProvider appId={appId} serverUrl={serverUrl}>
          <Fonts />
          <ToastContainer
            hideProgressBar
            draggablePercent={20}
            theme="dark"
            position="top-center"
          />
          <Router location={location} routes={routes}>
            <Outlet />
          </Router>
        </MoralisProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;

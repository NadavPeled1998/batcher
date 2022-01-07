import { Home } from "../pages/Home";
import { Route } from "react-location";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { SendForm } from "../components/SendForm";

export const routes: Route[] = [
  {
    path: "",
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <SendForm />,
      },
    ],
  },
];

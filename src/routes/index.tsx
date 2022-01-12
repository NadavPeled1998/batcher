import { Route } from "react-location";
import { SendForm } from "../components/SendForm";
import { DefaultLayout } from "../layouts/DefaultLayout";

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

import { Route } from "react-location";
import { SendForm } from "../components/SendForm";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { History } from "../pages/History/History";

export const routes: Route[] = [
  {
    path: "",
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <SendForm />,
      },
      {
        path: "/history",
        element: <History />,
      },
    ],
  },
];

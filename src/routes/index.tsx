import { Route } from "react-location";
import { SendForm } from "../components/SendForm";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { History } from "../pages/History/History";
import Playground from "../pages/Playground";

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
      {
        path: "/playground",
        element: <Playground />,
      },
    ],
  },
];

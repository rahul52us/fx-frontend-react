import { lazy } from "react";
import { web } from "../constant/routes";
import { ecommerceRoutes } from "./component/ecommerceRoute";
const IndividualWebsite = lazy(
  () => import("../../pages/main/individualWebsite/IndividualWebsite")
);

export const WebRoutes = [
  {
    element: <IndividualWebsite />,
    path: web.index,
    publicRoutes: true,
  },
  ...ecommerceRoutes,
];

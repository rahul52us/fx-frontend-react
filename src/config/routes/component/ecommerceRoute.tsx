import { lazy } from "react";
import {  web } from "../../constant/routes";
const IndividualProductPage = lazy(() => import("../../../pages/main/Ecommerce/IndividualProductPage/IndividualProductPage"))
const Ecommerce = lazy(() => import("../../../pages/main/Ecommerce/Ecommerce"))

export const ecommerceRoutes  = [
  {
    element : <Ecommerce />,
    path: web.ecommerce.index,
    publicRoutes:true
  },
  {
    element : <Ecommerce />,
    path: web.ecommerce.products,
    publicRoutes:true
  },
  {
    element: <IndividualProductPage />,
    path: `${web.ecommerce.products}/:id`,
    publicRoutes :true
  }
];
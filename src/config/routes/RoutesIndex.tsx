import { Route, Routes } from "react-router-dom";
import { MainPublicRoutes } from "./MainPageRoutes";
import { AuthenticateRoutes } from "./AuthenticateRoutes";
import { DashboardRoutes } from "./DashbaordRoutes";
import MainLayout from "../layout/MainLayout/MainLayout";
import AuthenticateLayout from "../layout/authenticateLayout/AuthenticateLayout";
import DashboardLayout from "../layout/dashboardLayout/DashboardLayout";
import { observer } from "mobx-react-lite";
import { mainPrivateRoutes } from "./PrivateMainRoutes";
import PrivateMainLayout from "../layout/PrivateMainLayout/PrivateMainLayout";

import store from "../../store/store";
import WebLayout from "../layout/webLayout/WebLayout";
import { WebRoutes } from "./webRoutes";

const RouterIndex = observer(() => {
  const {
    auth: { user },
  } = store;

  return (
    <Routes>
      <Route element={<WebLayout />}>
        {WebRoutes.map((item, index) => {
          return <Route key={index} path={item.path} element={item.element} />;
        })}
      </Route>

      <Route element={<PrivateMainLayout />}>
        {mainPrivateRoutes.map((item, index) => {
          return <Route key={index} path={item.path} element={item.element} />;
        })}
      </Route>
      <Route element={<MainLayout />}>
        {MainPublicRoutes.map((item, index) =>
          user === null && item.publicRoute === false ? null : (
            <Route key={index} path={item.path} element={item.element} />
          )
        )}
      </Route>

      <Route element={<AuthenticateLayout />}>
        {AuthenticateRoutes.map((item, index) => {
          return <Route path={item.path} key={index} element={item.element} />;
        })}
      </Route>

      <Route element={<DashboardLayout />}>
        {DashboardRoutes.map((item, index) => {
          return <Route path={item.path} key={index} element={item.element} />;
        })}
      </Route>
    </Routes>
  );
});

export default RouterIndex;
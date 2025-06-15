import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { AuthenticateRoutes } from "./AuthenticateRoutes";
import { DashboardRoutes } from "./DashbaordRoutes";
import AuthenticateLayout from "../layout/authenticateLayout/AuthenticateLayout";
import DashboardLayout from "../layout/dashboardLayout/DashboardLayout";
import { observer } from "mobx-react-lite";
import store from "../../store/store";

const RouterIndex = observer(() => {
  const {
    auth: { restoreUser },
  } = store;

  const location = useLocation();
  const isAuthenticated = restoreUser();

  return (
    <Routes>
      {/* Root Redirect: if "/" hit */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Public/Auth routes */}
      <Route element={<AuthenticateLayout />}>
        {AuthenticateRoutes.map((item, index) => (
          <Route path={item.path} key={index} element={item.element} />
        ))}
      </Route>

      {/* Protected Dashboard routes */}
      <Route
        element={
          isAuthenticated ? (
            <DashboardLayout />
          ) : (
            <Navigate to="/login" replace state={{ from: location }} />
          )
        }
      >
        {DashboardRoutes.map((item, index) => (
          <Route path={item.path} key={index} element={item.element} />
        ))}
      </Route>
    </Routes>
  );
});

export default RouterIndex;

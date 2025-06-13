import {lazy} from 'react';
import { authentication } from '../constant/routes';

const Login = lazy(() => import("../../pages/Authentication/Login/Login"));
const Register = lazy(
  () => import("../../pages/Authentication/Register/Register")
);
const ForgotPassword = lazy(
  () => import("../../pages/Authentication/ForgotPassword/ForgotPassword")
);
const ResetPassword = lazy(
  () => import("../../pages/Authentication/ResetPassword/ResetPassword")
);
const CreateOrganisation2 = lazy(
  () => import("../../pages/Authentication/CreateOrganisation/createOrganisationStep2/CreateOrganisationStep2")
);

const VerifyEmail = lazy(
    () => import("../../pages/Authentication/VerifyEmail/VerifyEmail")
);
const PageNotFound = lazy(() => import("../component/common/WebPages/PageNotFound"));

const CreateOrganisationStep1 = lazy(() => import('../../pages/Authentication/CreateOrganisation/CreateOrganisationStep1'))

export const AuthenticateRoutes = [
    {
      element: <Login />,
      path: authentication.login,
      publicRoutes: true,
    },
    {
      element: <Register />,
      path: authentication.register,
      publicRoutes: true,
    },
    {
      element: <ForgotPassword />,
      path: authentication.forgotPassword,
      publicRoutes: true,
    },
    {
      element: <ResetPassword />,
      path: authentication.resetPassword,
      publicRoutes: true,
    },
    {
      element: <VerifyEmail />,
      path: authentication.verifyEmail,
    },
    {
      element: <CreateOrganisation2 showLogo={true} />,
      path: authentication.createOrganisation2,
    },
    {
      element : <CreateOrganisationStep1 />,
      path: authentication.createOrganisationStep1
    },
    {
      element : <PageNotFound />,
      path : '/*',
      privateRoutes : true
    },

  ];


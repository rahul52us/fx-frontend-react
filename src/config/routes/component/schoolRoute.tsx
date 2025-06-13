import { lazy } from "react";
import { web } from "../../constant/routes";
import WebsiteBuilder from "../../../pages/Dashboard/WebsiteCustomisation/component/WebsiteBuilder";
const WebsiteCustomisationIndex = lazy(
  () =>
    import(
      "../../../pages/Dashboard/WebsiteCustomisation/WebsiteCustomisationIndex"
    )
);
const WebsiteBuildingIndex = lazy(
  () =>
    import("../../../pages/Dashboard/WebsiteCustomisation/WebsitebuildingIndex")
);

export const WebsiteCustomisationRoutes = [
  {
    element: <WebsiteCustomisationIndex />,
    path: web.websiteCustomisation.index,
    publicRoutes: true,
  },
  {
    element: <WebsiteBuildingIndex />,
    path: web.websiteCustomisation.create,
    publicRoutes: true,
  },
  {
    element: <WebsiteBuilder />,
    path: web.websiteCustomisation.edit,
    publicRoutes: true,
  },
];

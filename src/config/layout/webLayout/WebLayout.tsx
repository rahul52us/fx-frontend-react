import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Loader from "../../component/Loader/Loader";
import {
  WebLargeScreenHeaderHeight,
  WebSmallScreenHeaderHeight,
  headerHeight,
} from "../../constant/variable";
import { observer } from "mobx-react-lite";
import { useColorModeValue, useMediaQuery, useTheme } from "@chakra-ui/react";
import styled from "styled-components";
import MainLayout from "../MainLayout/MainLayout"; // Import Main Layout
import EcommerceLayout from "../../../pages/main/Ecommerce/layout/MainLayout"; // Import Ecommerce Layout
import SchoolLayout from "../../../pages/main/School/layout/MainLayout";

const WebLayout = observer(() => {
  const theme = useTheme();
  const location = useLocation();
  const [sizeStatus] = useMediaQuery(`(max-width: ${theme.breakpoints.xl})`);

  // Move useColorModeValue outside of getLayout function
  const backgroundColor = useColorModeValue("#ffffff", "#1A202C");

  // Scroll to top when the location changes (new page is opened)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Function to determine the layout based on the path
  const getLayout = () => {
    const { pathname } = location;

    switch (true) {
      case pathname.startsWith("/ecommerce"):
        return <EcommerceLayout />; // Render EcommerceLayout for ecommerce paths
      case pathname.startsWith("/school"):
        return <SchoolLayout />; // If there's no layout yet for school, return null
      case pathname.startsWith("/main"):
        return <MainLayout />; // Render MainLayout for main paths
      default:
        return (
          <div
            style={{
              backgroundColor: backgroundColor, // Use backgroundColor here
            }}
          >
            <ContentContainer sizeStatus={sizeStatus}>
              <Suspense fallback={<Loader height="90vh" />}>
                <Outlet /> {/* Render default Outlet for other paths */}
              </Suspense>
            </ContentContainer>
          </div>
        );
    }
  };

  return getLayout(); // Return the appropriate layout based on the path
});

const ContentContainer = styled.div<{ sizeStatus: Boolean }>`
  margin-top: ${({ sizeStatus }) =>
    sizeStatus ? WebSmallScreenHeaderHeight : WebLargeScreenHeaderHeight};
  overflow-x: hidden;
  /* height: calc(100vh - ${headerHeight}); */
  transition: all 0.3s ease-in-out;
  &.fullscreen {
    width: 100vw;
    transition: width 0.3s ease-in-out;
  }
`;

export default WebLayout;

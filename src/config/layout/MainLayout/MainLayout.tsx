import { Suspense, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
// import Footer from "./FooterLayout/FooterLayout";
import HeaderLayout from "./HeaderLayout/HeaderLayout";
import Loader from "../../component/Loader/Loader";
import {
  LargeScreenHeaderHeight,
  SmallScreenHeaderHeight,
  headerHeight,
} from "../../constant/variable";
import { observer } from "mobx-react-lite";
import { useColorModeValue, useMediaQuery, useTheme } from "@chakra-ui/react";
import styled from "styled-components";
import { main } from "../../constant/routes";
import FooterLayout from "./FooterLayout/FooterLayout";
import store from "../../../store/store";

const RedirectComponent = observer(() => {
  const navigate = useNavigate();

  const {
    auth: { restoreUser, user },
  } = store;
  useEffect(() => {
    if (!restoreUser()) {
      navigate("/login");
    }
  }, [navigate, restoreUser, user]);
  return <></>;
});

const MainLayout = observer(() => {
  const theme = useTheme();
  const location = useLocation();
  const [sizeStatus] = useMediaQuery(`(max-width: ${theme.breakpoints.xl})`);
  const {
    auth: { user },
  } = store;
  // Scroll to top when the location changes (new page is opened)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);


  return (
    user ? <div
      style={{
        backgroundColor: useColorModeValue("#ffffff", "#1A202C"),
      }}
    >
      <HeaderLayout />
      <ContentContainer sizeStatus={sizeStatus}>
        <Suspense fallback={<Loader height="90vh" />}>
          <Outlet />
        </Suspense>
        {/* {location.pathname !== main.profile && <Footer />} */}
        {location.pathname !== main.profile && <FooterLayout />}
      </ContentContainer>
    </div> : <RedirectComponent />
  );
});

const ContentContainer = styled.div<{ sizeStatus: Boolean }>`
  margin-top: ${({ sizeStatus }) =>
    sizeStatus ? SmallScreenHeaderHeight : LargeScreenHeaderHeight};
  overflow-x: hidden;
  /* height: calc(100vh - ${headerHeight}); */
  transition: all 0.3s ease-in-out;
  &.fullscreen {
    width: 100vw;
    transition: width 0.3s ease-in-out;
  }
`;

export default MainLayout;
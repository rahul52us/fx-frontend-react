import { useEffect, useRef } from "react";
import { Suspense } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import HeaderLayout from "./HeaderLayout/HeaderLayout";
import {
  contentLargeBodyPadding,
  contentSmallBodyPadding,
  headerHeight,
  mediumSidebarWidth,
} from "../../constant/variable";
import Loader from "../../component/Loader/Loader";
import { observer } from "mobx-react-lite";
import store from "../../../store/store";
import styled from "styled-components";
import SidebarLayout from "./SidebarLayout/SidebarLayout";
import {
  Box,
  useBreakpointValue,
  useColorModeValue,
  useMediaQuery,
  useTheme,
} from "@chakra-ui/react";
import PermissionDeniedPage from "../../component/commonPages/PermissionDeniedPage";
import { authentication } from "../../constant/routes";

const RedirectComponent = observer(() => {
  const navigate = useNavigate();

  const {
    auth: { restoreUser },
  } = store;
  useEffect(() => {
    if (!restoreUser()) {
      navigate("/login");
    }
  }, [navigate, restoreUser]);
  return <></>;
});

const DashboardLayout = observer(() => {
  const {
    auth: { restoreUser, user, checkPermission },
    layout: {
      fullScreenMode,
      mediumScreenMode,
      isCallapse,
      openDashSidebarFun,
      openMobileSideDrawer,
      setOpenMobileSideDrawer,
    },
    themeStore: { themeConfig },
  } = store;

  const navigate = useNavigate();
  const theme = useTheme();

  const [sizeStatus] = useMediaQuery(`(max-width: ${theme.breakpoints.xl})`);
  const isMobile = useBreakpointValue({ base: true, lg: false }) ?? false;
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!restoreUser()) {
      navigate("/login");
    }
  }, [restoreUser, navigate]);

  const closeDrawerModel = () => {
    setOpenMobileSideDrawer(false);
  };

  const handleSidebarItemClick = (item: any) => {
    if (!item.children || item.url) {
      localStorage.setItem("activeComponentName", item.id);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        openDashSidebarFun(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCallapse, openDashSidebarFun]);

  return user ? (
    <PermissionDeniedPage
    show={!checkPermission('dashboard', 'view')}
    onClick={() => navigate(authentication.login)}
    >
      <MainContainer isMobile={isMobile}>
        <Box ref={sidebarRef}>
          <SidebarLayout
            onItemClick={handleSidebarItemClick}
            isCollapsed={isCallapse}
            onLeafItemClick={handleSidebarItemClick}
            openMobileSideDrawer={openMobileSideDrawer}
            setOpenMobileSideDrawer={closeDrawerModel}
          />
        </Box>
        <Container fullScreenMode={fullScreenMode}>
          <HeaderContainer
            isMobile={isMobile}
            sizeStatus={sizeStatus}
            mediumScreenMode={mediumScreenMode}
            fullScreenMode={fullScreenMode}
            backgroundColor={useColorModeValue(
              themeConfig.colors.custom.light.primary,
              themeConfig.colors.custom.dark.primary
            )}
          >
            <HeaderLayout />
          </HeaderContainer>
          <ContentContainer
            isMobile={isMobile}
            mediumScreenMode={mediumScreenMode}
            className={
              fullScreenMode
                ? "fullscreen"
                : mediumScreenMode
                ? "mediumScreen"
                : ""
            }
            fullScreenMode={fullScreenMode}
            sizeStatus={sizeStatus}
          >
            <Suspense fallback={<Loader height="90vh" />}>
              <Outlet />
            </Suspense>
          </ContentContainer>
        </Container>
      </MainContainer>
    </PermissionDeniedPage>
  ) : (
    <RedirectComponent />
  );
});

export default DashboardLayout;

const MainContainer = styled.div<{ isMobile: boolean }>`
  display: flex;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
  margin-left: ${(props) => (props.isMobile ? "0px" : mediumSidebarWidth)};
`;

const Container = styled.div<{ fullScreenMode: boolean }>`
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease-in-out;
`;

const HeaderContainer = styled.div<{
  fullScreenMode: boolean;
  sizeStatus: boolean;
  mediumScreenMode: boolean;
  backgroundColor: any;
  isMobile: boolean;
}>`
  zindex: 9999;
  height: ${headerHeight};
  position: fixed;
  top: 0;
  right: 0;
  background-color: ${(props) => props.backgroundColor};
  left: ${(props) => (props.isMobile ? "0px" : mediumSidebarWidth)};
  transition: all 0.3s ease-in-out;
`;

const ContentContainer = styled.div<{
  sizeStatus: boolean;
  fullScreenMode: boolean;
  mediumScreenMode: boolean;
  isMobile: boolean;
}>`
  padding: ${({ isMobile }) =>
    isMobile ? `${contentSmallBodyPadding}` : `${contentLargeBodyPadding}`};
  width: ${({ isMobile }) =>
    isMobile ? "100vw" : `calc(100vw - ${mediumSidebarWidth})`};
  overflow-x: hidden;
  height: calc(100vh - ${headerHeight});
  transition: all 0.3s ease-in-out;
  margin-top: ${headerHeight};
`;

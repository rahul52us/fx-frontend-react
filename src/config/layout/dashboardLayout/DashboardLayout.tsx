import {
  Box,
  useBreakpointValue,
  useMediaQuery,
  useTheme,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { Suspense, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { glassCardStyle } from "../../../globalStyles";
import store from "../../../store/store";
import PermissionDeniedPage from "../../component/commonPages/PermissionDeniedPage";
import Loader from "../../component/Loader/Loader";
import { authentication } from "../../constant/routes";
import {
  headerHeight,
} from "../../constant/variable";
import HeaderLayout from "./HeaderLayout/HeaderLayout";
import SidebarLayout from "./SidebarLayout/SidebarLayout";
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
        <Box ref={sidebarRef} {...glassCardStyle}>
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
`;
const Container = styled.div<{ fullScreenMode: boolean }>`
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease-in-out;
  WIDTH: 100%;
`;
const HeaderContainer = styled.div<{
  fullScreenMode: boolean;
  sizeStatus: boolean;
  mediumScreenMode: boolean;
  isMobile: boolean;
}>`
  zindex: 9999;
  height: ${headerHeight};
  position: sticky;
  top: 0;
  right: 0;  

  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ContentContainer = styled.div<{
  sizeStatus: boolean;
  fullScreenMode: boolean;
  mediumScreenMode: boolean;
  isMobile: boolean;
}>`
  padding:5px 10px;
  overflow-x: auto;
  height: calc(100vh - ${headerHeight});
  transition: all 0.3s ease-in-out;  
`;
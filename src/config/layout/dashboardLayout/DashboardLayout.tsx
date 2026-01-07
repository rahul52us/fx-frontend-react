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
import { headerHeight } from "../../constant/variable";
import HeaderLayout from "./HeaderLayout/HeaderLayout";
import SidebarLayout from "./SidebarLayout/SidebarLayout";

/* ---------------- Redirect ---------------- */

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

  return null;
});

/* ---------------- Dashboard Layout ---------------- */

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
      show={!checkPermission("dashboard", "view")}
      onClick={() => navigate(authentication.login)}
    >
      <MainContainer isMobile={isMobile}>
        {/* Sidebar */}
        <Box ref={sidebarRef} {...glassCardStyle}>
          <SidebarLayout
            onItemClick={handleSidebarItemClick}
            isCollapsed={isCallapse}
            onLeafItemClick={handleSidebarItemClick}
            openMobileSideDrawer={openMobileSideDrawer}
            setOpenMobileSideDrawer={closeDrawerModel}
          />
        </Box>

        {/* Main Content */}
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
            fullScreenMode={fullScreenMode}
            sizeStatus={sizeStatus}
            className={
              fullScreenMode
                ? "fullscreen"
                : mediumScreenMode
                ? "mediumScreen"
                : ""
            }
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

/* ===================== STYLES ===================== */

/* 🔥 ROOT FIX: lock horizontal overflow at layout level */

const MainContainer = styled.div<{ isMobile: boolean }>`
  display: flex;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;   /* 🔥 MOST IMPORTANT FIX */
  transition: all 0.3s ease-in-out;
`;

const Container = styled.div<{ fullScreenMode: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;   /* 🔥 REQUIRED */
  transition: all 0.3s ease-in-out;
`;

const HeaderContainer = styled.div<{
  fullScreenMode: boolean;
  sizeStatus: boolean;
  mediumScreenMode: boolean;
  isMobile: boolean;
}>`
  z-index: 9999;
  height: ${headerHeight};
  position: sticky;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: inherit;
`;

const ContentContainer = styled.div<{
  sizeStatus: boolean;
  fullScreenMode: boolean;
  mediumScreenMode: boolean;
  isMobile: boolean;
}>`
  padding: 5px 10px;
  height: calc(100vh - ${headerHeight});
  overflow-x: hidden;   /* 🔥 THIS FIX STOPS PAGE SHIFT */
  overflow-y: auto;
  transition: all 0.3s ease-in-out;
`;

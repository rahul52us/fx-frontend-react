import { useEffect, useRef } from "react";
import { Suspense } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import HeaderLayout from "./HeaderLayout/HeaderLayout";
import {
  contentLargeBodyPadding,
  contentSmallBodyPadding,
  headerHeight,
  // mediumSidebarWidth,
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
    auth: { restoreUser, user },
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
console.log("isMobile",isMobile);

  return user ? (
    <Box
    >
      {/* <MainContainer isMobile={isMobile}> */}
       <Container fullScreenMode={fullScreenMode} >
        <Box boxShadow="1px -1px 4px -1px rgba(0, 0, 0, 0.12)">
          <SidebarLayout
            onItemClick={handleSidebarItemClick}
            isCollapsed={isCallapse}
            onLeafItemClick={handleSidebarItemClick}
            openMobileSideDrawer={openMobileSideDrawer}
            setOpenMobileSideDrawer={closeDrawerModel}
          />
        </Box>
       <Box display={"flex"} flexDirection={"column"} width={"100%"}>
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
            <HeaderLayout  />
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
          </Box>
        </Container>
      {/* </MainContainer> */}
    </Box>
  ) : (
    <RedirectComponent />
  );
});

export default DashboardLayout;

// const MainContainer = styled.div<{ isMobile: boolean }>`
//   display: flex;
//   transition: all 0.3s ease-in-out;
//   overflow: hidden;
//   // margin-left: ${(props) => (props.isMobile ? "0px" : mediumSidebarWidth)};
// `;

const Container = styled.div<{ fullScreenMode: boolean }>`
  display: flex;
  transition: all 0.3s ease-in-out;
  width: 100%;
`;

const HeaderContainer = styled.div<{
  fullScreenMode: boolean;
  sizeStatus: boolean;
  mediumScreenMode: boolean;
  backgroundColor: any;
  isMobile: boolean;
}>`
  zindex: 9999;
  position: sticky;
  top: 0; 
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.backgroundColor}; 
  transition: all 0.3s ease-in-out;
  padding: 5px 15px 0px 5px;
`;

const ContentContainer = styled.div<{
  sizeStatus: boolean;
  fullScreenMode: boolean;
  mediumScreenMode: boolean;
  isMobile: boolean;
}>`
  padding: ${({ isMobile }) =>
    isMobile ? `${contentSmallBodyPadding}` : `${contentLargeBodyPadding}`};
  overflow-x: hidden;
  height: calc(100vh - ${headerHeight});
  width: 100%;
  transition: all 0.3s ease-in-out;
`;

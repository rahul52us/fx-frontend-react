'use client';

import { useEffect, useRef, startTransition, Suspense, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Spinner,
  useBreakpointValue,
  useColorModeValue,
  useMediaQuery,
  useTheme,
} from '@chakra-ui/react';
import styled from 'styled-components';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

import SidebarLayout from './SidebarLayout/SidebarLayout';
import HeaderLayout from './HeaderLayout/HeaderLayout';
import store from '../../../store/store';
import ThemeChangeContainer from '../../component/themeChangeContainer/ThemeChangeContainer';
import PageLoader from '../../component/Loader/PageLoader';
import {
  contentLargeBodyPadding,
  contentSmallBodyPadding,
  headerHeight,
  mediumSidebarWidth,
} from '../../constant/variable';
import { dashboard } from '../../constant/routes';

const DashboardLayout = observer(() => {
  const {
    auth: { user },
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
  const location = useLocation();
  const theme = useTheme();
  const [sizeStatus] = useMediaQuery(`(max-width: ${theme.breakpoints.xl})`);
  const isMobile = useBreakpointValue({ base: true, lg: false }) ?? false;
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const closeDrawerModel = useCallback(() => {
    setOpenMobileSideDrawer(false);
  }, [setOpenMobileSideDrawer]);

  const handleSidebarItemClick = (item: any) => {
    if (!item.children || item.url) {
      localStorage.setItem('activeComponentName', item.id);
    }
  };

  /* ------------------ OUTSIDE CLICK ------------------ */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        openDashSidebarFun(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCallapse, openDashSidebarFun]);

  /* ------------------ SAVE LAST PAGE ------------------ */
  useEffect(() => {
    if (!store.auth.user) return;

    if (
      location.pathname.startsWith('/login') ||
      location.pathname.startsWith('/forgot') ||
      location.pathname.startsWith('/register')
    ) {
      return;
    }

    if (!sessionStorage.getItem('justLoggedIn')) {
      sessionStorage.setItem('lastRoute', location.pathname);
    }
  }, [location.pathname]);

  /* ------------------ ROLE + REFRESH SAFE NAV ------------------ */
  useEffect(() => {
    if (!user?.role) return;

    const justLoggedIn = sessionStorage.getItem('justLoggedIn');
    const lastRoute = sessionStorage.getItem('lastRoute');

    startTransition(() => {
      if (justLoggedIn) {
        sessionStorage.removeItem('justLoggedIn');

        switch (user.role) {
          case 'superadmin':
            navigate(dashboard.superAdminTab, { replace: true });
            break;
          case 'admin':
            navigate(dashboard.home, { replace: true });
            break;
          default:
            navigate(dashboard.home, { replace: true });
        }
        return;
      }

      if (lastRoute) {
        navigate(lastRoute, { replace: true });
      }
    });
  }, [user?.role, navigate]);

  /* ------------------ LOADER ------------------ */
  if (!user) {
    return (
      <PageLoader loading>
        <Spinner />
      </PageLoader>
    );
  }

  /* ------------------ UI (UNCHANGED) ------------------ */
  return (
    <Box>
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
              fullScreenMode ? 'fullscreen' : mediumScreenMode ? 'mediumScreen' : ''
            }
            fullScreenMode={fullScreenMode}
            sizeStatus={sizeStatus}
          >
            <Suspense
              fallback={
                <PageLoader loading>
                  <Spinner />
                </PageLoader>
              }
            >
              <Outlet />
            </Suspense>
          </ContentContainer>
        </Container>
      </MainContainer>

      <ThemeChangeContainer />
    </Box>
  );
});

export default DashboardLayout;

/* ================= STYLES ================= */

const MainContainer = styled.div<{ isMobile: boolean }>`
  display: flex;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
  margin-left: ${(props) => (props.isMobile ? '0px' : mediumSidebarWidth)};
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
  backgroundColor: string;
  isMobile: boolean;
}>`
  z-index: 99;
  height: ${headerHeight};
  position: fixed;
  top: 0;
  right: 0;
  background-color: ${(props) => props.backgroundColor};
  left: ${(props) => (props.isMobile ? '0px' : mediumSidebarWidth)};
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
    isMobile ? '100vw' : `calc(100vw - ${mediumSidebarWidth})`};
  overflow-x: hidden;
  height: calc(100vh - ${headerHeight});
  transition: all 0.3s ease-in-out;
  margin-top: ${headerHeight};
`;

import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import i18n from "i18next";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { initReactI18next } from "react-i18next";
import { useLocation } from "react-router-dom";
import "./App.css";
import ErrorBoundary from "./config/component/ErrorBoundary/ErrorBoundary";
import WebLoader from "./config/component/Loader/WebLoader";
import Notification from "./config/component/Notification/Notification";
import ScrollToTopButton from "./config/component/ScrollToTopBottom/ScrollToTopBottom";
import DashSearchBar from "./config/component/common/DashSearchBar/DashSearchBar";
import ThemeChangeContainer from "./config/component/themeChangeContainer/ThemeChangeContainer";
import enTranslation from "./config/locales/en.json";
import hiTranslation from "./config/locales/hi.json";
import RouterIndex from "./config/routes/RoutesIndex";
import theme from "./config/theme/theme";
import { GlobalStyles } from "./globalStyles";
import LoginModel from "./pages/Authentication/LoginModel/LoginModel";
import store from "./store/store";

const App = observer(() => {
  const { auth: { webLoader } } = store
  const { pathname } = useLocation();
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: enTranslation },
      hi: { translation: hiTranslation },
    },
    lng: localStorage.getItem("setLanguage") as any,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <GlobalStyles />
      <ErrorBoundary>
        <Notification />
        {webLoader ? <WebLoader /> : <RouterIndex />}
        {/* <ChatMessageContainer /> */}
        <LoginModel />
        <DashSearchBar />
        <ThemeChangeContainer />
        <ScrollToTopButton />
      </ErrorBoundary>
    </ChakraProvider>
  );
});

export default App;
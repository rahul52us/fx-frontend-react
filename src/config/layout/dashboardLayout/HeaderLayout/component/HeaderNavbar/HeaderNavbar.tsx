import { Flex, IconButton, useMediaQuery } from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";
import { observer } from "mobx-react-lite";
import HeaderProfile from "./HeaderProfile/HeaderProfile";
// import HeaderNotification from "./HeaderNotification/HeaderNotification";
// import HeaderThemeSwitch from "./HeaderThemeSwitch/HeaderThemeSwitch";
import store from "../../../../../../store/store";

const HeaderNavbar = observer(() => {
  const {
    layout: { setOpenMobileSideDrawer },
  } = store;
  const [isLargerThan1020] = useMediaQuery("(min-width: 1020px)");

  return (
    <Flex
      display="flex"
      justifyContent="space-around"
      alignItems="center"
      width={isLargerThan1020 ? "18%" : "10%"}
    >
      {isLargerThan1020 ? (
        <>
          {/* <HeaderLanguageSwitch /> */}
          {/* <HeaderThemeSwitch /> */}
          {/* <HeaderChatMessage /> */}
          {/* <HeaderNotification /> */}
          {/* <CartContainer /> */}
          <Flex justify={'end'} w={'100%'} pr={2}>
          <HeaderProfile />
          </Flex>
        </>
      ) : (
        <IconButton
          aria-label="Arrow"
          fontSize="xl"
          // color="white"
          _hover={{ color: "blue.500", bg: "gray.700" }}
          _active={{ bg: "gray.800" }}
        >
          <FaBars
            cursor="pointer"
            onClick={() => setOpenMobileSideDrawer(true)}
          />
        </IconButton>
      )}
    </Flex>
  );
});

export default HeaderNavbar;

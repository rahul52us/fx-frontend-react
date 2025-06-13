import { Flex, IconButton, Input, useBreakpointValue } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import store from "../../../../../../store/store";

const HeaderLogo = observer(() => {
  const isLargerThanXl = useBreakpointValue({ lg: true });

  const {
    layout: { fullScreenMode, openDashSidebarFun, isCallapse },
    auth: { closeSearchBar },
  } = store;
  return (
    <Flex alignItems="center" display={"flex"} ml={2}>
      {isLargerThanXl && (
        <Flex alignItems="center">
          <IconButton
            variant="ghost"
            aria-label="Arrow"
            fontSize="2xl"
            color="white"
            _hover={{ color: "blue.500", bg: "gray.700" }}
            _active={{ bg: "gray.800" }}
            icon={
              isCallapse ? (
                <BiRightArrowAlt fontSize={25} />
              ) : (
                <BiLeftArrowAlt fontSize={25} />
              )
            }
            size="lg"
            style={{ marginRight: "1rem", marginTop: "2px" }}
            onClick={() => {
              openDashSidebarFun();
              // mediumScreenModeFun(!mediumScreenMode);
            }}
          />
          <IconButton
            icon={
              fullScreenMode ? (
                <BiRightArrowAlt fontSize={25} />
              ) : (
                <BiLeftArrowAlt fontSize={25} />
              )
            }
            onClick={() => openDashSidebarFun()}
            variant="ghost"
            size="lg"
            style={{ marginRight: "1rem", marginTop: "2px" }}
            aria-label="open the drawer button"
            display="none"
          />
        </Flex>
      )}
      <Input
        type="text"
        // name="search"
        value=""
        placeholder="Search here"
        w={isLargerThanXl ? "90%" : "95%"}
        onKeyDown={closeSearchBar}
      />
    </Flex>
  );
});

export default HeaderLogo;

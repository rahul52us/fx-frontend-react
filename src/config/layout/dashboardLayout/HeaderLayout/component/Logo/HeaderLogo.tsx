import { Flex, IconButton, Input, InputGroup, InputLeftElement, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
// import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import store from "../../../../../../store/store";
import {
  hoverColor,
  inputBorderColorFocus,
} from "../../../../../../globalColors";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";

const HeaderLogo = observer(() => {
  const isLargerThanXl = useBreakpointValue({ lg: true });
  const searchBg = useColorModeValue("white", "gray.700");

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
            fontSize="1xl"
            _hover={{
              color: "black.500",
              bg: `${hoverColor}`,
              borderRadius: "100px",
            }}
            _active={{
              color: "black.500",
              bg: `${hoverColor}`,
              borderRadius: "100px",
            }}
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
      <InputGroup w={isLargerThanXl ? "90%" : "95%"}>
        <InputLeftElement pointerEvents="none">
          <FaSearch color="gray.300" />
        </InputLeftElement>
        <Input
          type="text"
          // name="search"
          value=""
          placeholder="Search..."
          onKeyDown={closeSearchBar}
          borderRadius="full"
          bg={searchBg}
          border="none"
          _focus={{
            borderColor: `${inputBorderColorFocus}`,
            boxShadow: "0 0 0 1px #3182ce",
            bg: useColorModeValue("white", "gray.600")
          }}
          _placeholder={{ color: 'gray.500' }}
        />
      </InputGroup>
    </Flex>
  );
});

export default HeaderLogo;

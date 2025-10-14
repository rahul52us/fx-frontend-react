import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Text,
  VStack,
  useBreakpointValue,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { primaryColor, secondaryColor } from "../../../../globalColors";
import { glassCardStyle } from "../../../../globalStyles";
import store from "../../../../store/store";
import { mediumSidebarWidth, sidebarWidth } from "../../../constant/variable";
import SidebarLogo from "./component/SidebarLogo";
import { getSidebarDataByRole, sidebarFooterData } from "./utils/SidebarItems";

export interface SidebarItem {
  id: number;
  name: string;
  icon: JSX.Element;
  url: string;
  children?: SidebarItem[];
}

interface SidebarProps {
  isCollapsed: boolean;
  onItemClick: (item: SidebarItem) => void;
  onLeafItemClick: (item: SidebarItem) => void;
  openMobileSideDrawer: boolean;
  setOpenMobileSideDrawer: any;
}

// const renderIcon = (depth: number, icon: JSX.Element, colorMode: string) => {
//   const iconColor = colorMode === "light" ? "gray.800" : "gray.200";

//   if (depth === 1) {
//     return (
//       <Text fontSize={"18px"} mr={2} color={iconColor}>
//         -
//       </Text>
//     );
//   }
//   if (depth > 1) {
//     return (
//       <Text fontSize={"18px"} mr={2} color={iconColor}>
//         ◦
//       </Text>
//     );
//   }
//   return <Icon as={icon.type} boxSize={5} color={iconColor} />;
// };

// import { Tooltip, Icon, Text, Box } from "@chakra-ui/react";

const renderIcon = (depth: number, icon: JSX.Element, colorMode: string) => {
  const iconColor = colorMode === "light" ? "gray.800" : "gray.200";

  if (depth === 1) {
    return (
      // <Tooltip label={label} hasArrow placement="right">
      <Box as="span"  cursor="pointer">
        <Text fontSize="18px" color={iconColor}>
          -
        </Text>
      </Box>
      // </Tooltip>
    );
  }

  if (depth > 1) {
    return (
      // <Tooltip label={label} hasArrow placement="right">
      <Box as="span"  cursor="pointer">
        <Text fontSize="18px" color={iconColor}>
          ◦
        </Text>
      </Box>
      // </Tooltip>
    );
  }

  return (
    // <Tooltip label={label} hasArrow placement="right">
    <Box as="span" mr={2} cursor="pointer">
      <Icon as={icon.type} boxSize={5} color={iconColor} />
    </Box>
    // </Tooltip>
  );
};

const findPathToActiveItem = (
  items: SidebarItem[],
  activeItemId: number
): number[] => {
  const path: number[] = [];

  const findPath = (
    items: SidebarItem[],
    id: number,
    currentPath: number[]
  ): boolean => {
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      if (item.id === id) {
        path.push(...currentPath, index);
        return true;
      }
      if (item.children) {
        if (findPath(item.children, id, [...currentPath, index])) {
          return true;
        }
      }
    }
    return false;
  };

  findPath(items, activeItemId, []);
  return path;
};

const SidebarPopover = observer(
  ({
    item,
    depth,
    onClick,
    onLeafClick,
    isCollapsed,
    activeItemId,
  }: {
    item: SidebarItem;
    depth: number;
    onClick: (item: SidebarItem) => void;
    onLeafClick: (item: SidebarItem) => void;
    isCollapsed: boolean;
    activeItemId: number | null;
  }) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const { colorMode } = useColorMode();

    const handleMouseEnter = () => {
      if (item.children && item.children.length > 0 && isCollapsed) {
        setIsPopoverOpen(true);
      }
    };

    const handleItemClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsPopoverOpen(false);
      if (!item.children) {
        onLeafClick(item);
      } else {
        onClick(item);
      }
    };

    const isActive = (
      item: SidebarItem,
      activeItemId: number | null
    ): boolean => {
      if (item.id === activeItemId) {
        return true;
      }
      if (item.children) {
        return item.children.some((child) => isActive(child, activeItemId));
      }
      return false;
    };

    const itemIsActive = isActive(item, activeItemId);

    return (
      <Popover
        isOpen={isPopoverOpen}
        onClose={() => setIsPopoverOpen(false)}
        placement="right-start"
        closeOnBlur={false}
        trigger="hover"
      >
        <PopoverTrigger>
          <Flex
            align={"center"}
            width={"100%"}
            onMouseEnter={handleMouseEnter}
            onClick={handleItemClick}
          >
            <Flex
              align="center"
              justify={depth === 0 ? "center" : "unset"}
              width={"100%"}
              cursor="pointer"
              py={depth === 0 ? 3 : 1}
              color={
                itemIsActive
                  ? primaryColor 
                  : "inherit"
              }
              borderRight={
                itemIsActive
                  ? `3px solid ${primaryColor}`
                  : "3px solid transparent"
              }
              _hover={{
                color: primaryColor,
                bg: "rgba(0,124,138,0.05)", // subtle hover background
              }}
              fontWeight={itemIsActive ? "600" : "inherit"}
              // _hover={{
              //   bg: useColorModeValue("blue.50", "blue.700"),
              //   color: useColorModeValue(
              //     themeConfig.colors.custom.light.primary,
              //     themeConfig.colors.custom.dark.primary
              //   ),
              // }}
            >
              {renderIcon(depth, item.icon, colorMode)}
              {depth > 0 && (
                <Flex flex={1} align={"center"} justify={"space-between"}>
                  <Text fontSize={"sm"}>
                    {item.name}
                  </Text>
                  {/* {item.children && (
                    <ChevronRightIcon
                      ml={2}
                      color={colorMode === "light" ? "gray.800" : "gray.200"}
                    />
                  )} */}
                </Flex>
              )}
            </Flex>
          </Flex>
        </PopoverTrigger>
        {item.children && (
          <Portal>
            <PopoverContent
              zIndex={15}
              w={"200px"}
              onMouseEnter={handleMouseEnter}
              {...glassCardStyle}
              bg={useColorModeValue("white", "gray.800")}
            >
              <PopoverArrow color={primaryColor}/>
              <PopoverHeader bg={primaryColor} >
                <Flex
                  align="center"
                  justify="space-between"
                  width="100%"
                  pl={2}
                  my={0}
                  cursor="pointer"
                >
                  <Flex align="center" py={0}>
                    <Text
                      color={"white"}
                      fontSize="sm"
                      fontWeight={600}
                    >
                      {item.name}
                    </Text>
                  </Flex>
                  {item.children && (
                    <ChevronDownIcon
                      //  color={colorMode === "light" ? "gray.800" : "gray.200"}
                      color={"white"}
                      fontSize="19px"
                      fontWeight={600}
                    />
                  )}
                </Flex>
              </PopoverHeader>
              <PopoverBody>
                <VStack align="start" spacing={1}>
                  {item.children.map((child) => (
                    <SidebarPopover
                      key={child.id}
                      item={child}
                      depth={depth + 1}
                      onClick={onClick}
                      onLeafClick={onLeafClick}
                      isCollapsed={isCollapsed}
                      activeItemId={activeItemId}
                    />
                  ))}
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        )}
      </Popover>
    );
  }
);

const SidebarAccordion = observer(
  ({
    items,
    depth = 0,
    onClick,
    onLeafClick,
    activeItemId,
    expandedPath,
  }: {
    items: SidebarItem[];
    depth?: number;
    onClick: (item: SidebarItem) => void;
    onLeafClick: (item: SidebarItem) => void;
    activeItemId: number | null;
    expandedPath: number[];
  }) => {
    // const {
    //   themeStore: { themeConfig },
    // } = store;

    const { colorMode } = useColorMode();

    // const activeBg = useColorModeValue(
    //   themeConfig.colors.custom.light.primary,
    //   "blue.900"
    // );
    // const hoverBg = useColorModeValue("blue.50", "blue.700");
    // const hoverColor = useColorModeValue("teal.700", "teal.300");
    // const primaryColor = useColorModeValue(
    //   themeConfig.colors.custom.light.primary,
    //   themeConfig.colors.custom.dark.primary
    // );

    // Determine the index to expand based on the depth and expandedPath
    const expandedIndex =
      expandedPath.length > depth ? expandedPath[depth] : null;

    const isActive = (item: SidebarItem): boolean => {
      if (item.id === activeItemId) {
        return true;
      }
      if (item.children) {
        return item.children.some(isActive);
      }
      return false;
    };

    return (
      <Accordion
        width="100%"
        px={3}
        allowMultiple
        defaultIndex={expandedIndex !== null ? [expandedIndex] : []}
      >
        {items.map((item) => {
          const itemIsActive = isActive(item);
          const isMainMenu = depth === 0;

          return (
            <AccordionItem key={item.id} border="none" width="100%">
              {() => (
                <>
                  <AccordionButton
                    my={1}
                    px={2}
                    py={2}
                    borderRadius="6px"
                    bg="transparent"
                    color={itemIsActive ? primaryColor : secondaryColor}
                    fontWeight={itemIsActive ? "600" : "500"}
                    borderLeft={
                      itemIsActive
                        ? `3px solid ${primaryColor}`
                        : "3px solid transparent"
                    }
                    _hover={{
                      color: primaryColor,
                      bg: "rgba(0,124,138,0.05)", // subtle hover background
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!item.children) {
                        onLeafClick(item);
                      } else {
                        onClick(item);
                      }
                    }}
                  >
                    <Flex
                      align="center"
                      justify="space-between"
                      width="100%"
                      cursor="pointer"
                    >
                      <Flex align="center">
                        {renderIcon(depth, item.icon, colorMode)}
                        <Text
                          fontSize={isMainMenu ? "sm" : "xs"} // smaller font for children
                          ml={depth === 0 ? 3 : 4} // indent children
                          
                        >
                          {item.name}
                        </Text>
                      </Flex>

                      {item.children && (
                        <AccordionIcon color={secondaryColor} />
                      )}
                    </Flex>
                  </AccordionButton>

                  {item.children && (
                    <AccordionPanel pl={0} pr={0} pb={0} mt="-4px">
                      <VStack align="start" spacing={0} width="100%">
                        <SidebarAccordion
                          items={item.children}
                          depth={depth + 1}
                          onClick={onClick}
                          onLeafClick={onLeafClick}
                          activeItemId={activeItemId}
                          expandedPath={expandedPath}
                        />
                      </VStack>
                    </AccordionPanel>
                  )}
                </>
              )}
            </AccordionItem>
          );
        })}
      </Accordion>
    );
  }
);

const SidebarLayout: React.FC<SidebarProps> = observer(
  ({
    isCollapsed,
    onItemClick,
    onLeafItemClick,
    openMobileSideDrawer,
    setOpenMobileSideDrawer,
  }) => {
    const {
      auth: { user },
    } = store;
    const navigate = useNavigate();
    const isMobile = useBreakpointValue({ base: true, lg: false }) ?? false;
    const borderColor = useColorModeValue("gray.200", "gray.700");
    // const headerBgColor = useColorModeValue("gray.200", "gray.700");
    const [sidebarData, setSidebarData] = useState<any>([]);
    const [activeItemId, setActiveItemId] = useState<number | null>(() => {
      const storedActiveItemId = localStorage.getItem("activeSidebarItemId");
      return storedActiveItemId ? parseInt(storedActiveItemId, 10) : 1;
    });
    const { colorMode } = useColorMode();

    useEffect(() => {
      setSidebarData(getSidebarDataByRole(["user", user.role]));
    }, [user]);

    useEffect(() => {
      if (activeItemId !== null) {
        localStorage.setItem("activeSidebarItemId", activeItemId.toString());
      }
    }, [activeItemId]);

    const handleLeafItemClick = (item: SidebarItem) => {
      setActiveItemId(item.id);
      onLeafItemClick(item);
      navigate(item.url);
    };

    useEffect(() => {
      if (!isMobile) {
        setOpenMobileSideDrawer(false);
      }
    }, [isMobile, setOpenMobileSideDrawer]);

    const expandedPath =
      activeItemId !== null
        ? findPathToActiveItem(sidebarData, activeItemId)
        : [];

    return (
      <>
        <Drawer
          isOpen={openMobileSideDrawer}
          placement="right"
          onClose={() => setOpenMobileSideDrawer()}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton
              variant="ghost"
              fontSize="xl"
              color="white"
              _hover={{ color: "blue.500", bg: "gray.700" }}
              _active={{ bg: "gray.800" }}
              mt={2}
              _focus={{ boxShadow: "none" }}
            />
            <SidebarLogo />
            <DrawerBody px={2} className="customScrollBar">
              <SidebarAccordion
                items={sidebarData}
                onClick={onItemClick}
                onLeafClick={handleLeafItemClick}
                activeItemId={activeItemId}
                expandedPath={expandedPath}
              />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
        {!isMobile && (
          <Box
            // pos={"fixed"}
            // top={0}
            // bottom={0}
            // left={0}
            width={isCollapsed ? mediumSidebarWidth : sidebarWidth}
            // minH={"100vh"}
            // transition="width 0.3s"
            // color="gray.700"
            // zIndex={10}
            bg={colorMode === "dark" ? "gray.800" : "white"}
            // borderRight="1px"
            // boxShadow="rgb(0 0 0 / 20%) 0px 0px 11px"
            borderRightColor={borderColor}
            // className="customScrollBar"
          >
            <Box
              position="sticky"
              top={0}
              zIndex={11}
              bg={"white"}
              boxShadow="0px -1px 3px 0 rgba(0, 0, 0, 0.12)"
            >
              <SidebarLogo />
            </Box>
            <Box
              overflowY="auto"
              overflowX={"hidden"}
              className="customScrollBar"
              // py={6}
              // bg={"gray.50"}
              height="calc(100vh - 165px)" // Adjust based on the height of your header
            >
              {isCollapsed ? (
                <VStack align="start" spacing={3}>
                  {sidebarData.map((item: any) => (
                    <SidebarPopover
                      key={item.id}
                      item={item}
                      depth={0}
                      onClick={onItemClick}
                      onLeafClick={handleLeafItemClick}
                      isCollapsed={isCollapsed}
                      activeItemId={activeItemId}
                    />
                  ))}
                </VStack>
              ) : (
                <SidebarAccordion
                  items={sidebarData}
                  onClick={onItemClick}
                  onLeafClick={handleLeafItemClick}
                  activeItemId={activeItemId}
                  expandedPath={expandedPath}
                />
              )}
            </Box>
            <Box
              position="fixed"
              bottom={0}
              left={0}
              width={isCollapsed ? mediumSidebarWidth : sidebarWidth}
              transition="width 0.3s"
              py={4}
              zIndex={11}
              overflowX={"hidden"}
              // bg={"gray.100"}
            >
              {isCollapsed ? (
                <VStack align="start" spacing={3}>
                  {sidebarFooterData.map((item: any) => (
                    <SidebarPopover
                      key={item.id}
                      item={item}
                      depth={0}
                      onClick={onItemClick}
                      onLeafClick={handleLeafItemClick}
                      isCollapsed={isCollapsed}
                      activeItemId={activeItemId}
                    />
                  ))}
                </VStack>
              ) : (
                <SidebarAccordion
                  items={sidebarFooterData}
                  onClick={onItemClick}
                  onLeafClick={handleLeafItemClick}
                  activeItemId={activeItemId}
                  expandedPath={expandedPath}
                />
              )}
            </Box>
          </Box>
        )}
      </>
    );
  }
);

export default SidebarLayout;

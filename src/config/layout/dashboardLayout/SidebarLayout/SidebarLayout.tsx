"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
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
  useColorModeValue,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  useBreakpointValue,
  useColorMode,
  Tooltip,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { getSidebarDataByRole, sidebarFooterData } from "./utils/SidebarItems";
import { observer } from "mobx-react-lite";
import SidebarLogo from "./component/SidebarLogo";
import store from "../../../../store/store";
import { mediumSidebarWidth, sidebarWidth } from "../../../constant/variable";
import { useNavigate } from "react-router-dom";

export interface SidebarItem {
  id: number;
  name: string;
  icon: React.ReactElement;
  url: string;
  children?: SidebarItem[];
}

interface SidebarProps {
  isCollapsed: boolean;
  onItemClick: (item: SidebarItem) => void;
  onLeafItemClick: (item: SidebarItem) => void;
  openMobileSideDrawer: boolean;
  setOpenMobileSideDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

const renderIcon = (depth: number, icon: any, colorMode: string) => {
  const iconColor = colorMode === "light" ? "gray.700" : "gray.300";

  if (depth === 1) return <Text fontSize="lg" mr={2} color={iconColor}>–</Text>;
  if (depth > 1) return <Text fontSize="lg" mr={2} color={iconColor}>◦</Text>;

  return <Icon as={icon.type} boxSize={5} color={iconColor} />;
};

const SidebarPopover = observer(
  ({
    item,
    depth = 0,
    onClick,
    onLeafClick,
    isCollapsed,
    activeItemId,
  }: {
    item: SidebarItem;
    depth?: number;
    onClick: (item: SidebarItem) => void;
    onLeafClick: (item: SidebarItem) => void;
    isCollapsed: boolean;
    activeItemId: number | null;
  }) => {
    const {
      themeStore: { themeConfig },
    } = store;

    const { colorMode } = useColorMode();
    const [isOpen, setIsOpen] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const openDelayed = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (isCollapsed) {
          setIsOpen(true);
        }
      }, 120);
    };

    const closeDelayed = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 250);
    };

    const handleEnter = () => openDelayed();
    const handleLeave = () => closeDelayed();

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsOpen(false);

      if (!item.children?.length) {
        onLeafClick(item);
      } else {
        onClick(item);
      }
    };

    const isActive = (item: SidebarItem): boolean => {
      if (item.id === activeItemId) return true;
      return !!item.children?.some(isActive);
    };

    const itemIsActive = isActive(item);

    return (
      <Popover
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        placement="right-start"
        closeOnBlur={true}
        closeOnEsc={true}
        trigger="hover"
        strategy="fixed"
        flip={true}
        preventOverflow={true}
        modifiers={[
          {
            name: "preventOverflow",
            options: { boundary: "clippingParents", padding: 16 },
          },
          {
            name: "flip",
            options: {
              fallbackPlacements: ["right-end", "left-start", "bottom", "top"],
            },
          },
        ]}
      >
        <PopoverTrigger>
          <Flex
            align="center"
            w="100%"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            onClick={handleClick}
            cursor="pointer"
          >
            <Tooltip
              label={item.name}
              // Show tooltip only for items WITHOUT children (leaf items)
              isDisabled={!isCollapsed || !!item.children?.length}
              placement="right"
              hasArrow
              openDelay={400}
              bg={useColorModeValue(themeConfig.colors.custom.light.primary, "gray.800")}
              color="white"
              px={3}
              py={1.5}
              borderRadius="md"
              fontSize="sm"
            >
              <Flex
                align="center"
                justify={depth === 0 ? "center" : "flex-start"}
                w="100%"
                py={depth === 0 ? 3 : 2}
                px={depth === 0 ? 0 : 3}
                bg={itemIsActive ? useColorModeValue("blue.50", "blue.900") : "transparent"}
                color={
                  itemIsActive
                    ? useColorModeValue(themeConfig.colors.custom.light.primary, themeConfig.colors.custom.dark.primary)
                    : "inherit"
                }
                fontWeight={itemIsActive ? "semibold" : "normal"}
                _hover={{
                  bg: useColorModeValue("gray.100", "gray.700"),
                  color: useColorModeValue(themeConfig.colors.custom.light.primary, themeConfig.colors.custom.dark.primary),
                }}
                transition="all 0.15s"
                rounded="md"
              >
                {renderIcon(depth, item.icon, colorMode)}
                {depth > 0 && (
                  <Flex flex={1} align="center" justify="space-between" pl={3}>
                    <Text fontSize="sm">{item.name}</Text>
                    {item.children?.length ? (
                      <ChevronRightIcon
                        color={colorMode === "light" ? "gray.600" : "gray.400"}
                        boxSize={4}
                      />
                    ) : null}
                  </Flex>
                )}
              </Flex>
            </Tooltip>
          </Flex>
        </PopoverTrigger>

        {item.children?.length ? (
          <Portal>
            <PopoverContent
              w="220px"
              maxH="80vh"
              overflowY="auto"
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
              boxShadow="xl"
              bg={useColorModeValue("white", "gray.800")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
              _focus={{ outline: "none" }}
              p={1}
            >
              <PopoverArrow />
              <PopoverHeader
                bg={useColorModeValue("blue.50", "blue.900")}
                borderBottomWidth="1px"
                borderColor={useColorModeValue("gray.200", "gray.700")}
                py={2}
                px={3}
              >
                <Text fontWeight="semibold" fontSize="sm">
                  {item.name}
                </Text>
              </PopoverHeader>
              <PopoverBody p={1}>
                <VStack align="stretch" spacing={0.5}>
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
        ) : null}
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
    const {
      themeStore: { themeConfig },
    } = store;
    const { colorMode } = useColorMode();

    const hoverBg = useColorModeValue("blue.50", "blue.700");
    const primaryColor = useColorModeValue(themeConfig.colors.custom.light.primary, themeConfig.colors.custom.dark.primary);

    const expandedIndex = expandedPath.length > depth ? expandedPath[depth] : null;

    return (
      <Accordion allowMultiple defaultIndex={expandedIndex !== null ? [expandedIndex] : []}>
        {items.map((item) => {
          const isActive = item.id === activeItemId || item.children?.some(c => c.id === activeItemId);
          return (
            <AccordionItem key={item.id} border="none">
              <AccordionButton
                my={1.5}
                px={3}
                borderRadius="md"
                bg={isActive ? useColorModeValue("blue.50", "blue.900") : "transparent"}
                color={isActive ? primaryColor : "inherit"}
                fontWeight={isActive ? "semibold" : "normal"}
                _hover={{ bg: hoverBg }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!item.children?.length) onLeafClick(item);
                  else onClick(item);
                }}
              >
                <Flex align="center" flex="1" gap={3}>
                  {renderIcon(depth, item.icon, colorMode)}
                  <Text fontSize="sm">{item.name}</Text>
                </Flex>
                {item.children?.length ? <AccordionIcon /> : null}
              </AccordionButton>

              {item.children?.length ? (
                <AccordionPanel pb={1} pl={depth === 0 ? 8 : 10}>
                  <SidebarAccordion
                    items={item.children}
                    depth={depth + 1}
                    onClick={onClick}
                    onLeafClick={onLeafClick}
                    activeItemId={activeItemId}
                    expandedPath={expandedPath}
                  />
                </AccordionPanel>
              ) : null}
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
    const { colorMode } = useColorMode();

    const [sidebarData, setSidebarData] = useState<SidebarItem[]>([]);
    const [activeItemId, setActiveItemId] = useState<number | null>(() => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("activeSidebarItemId");
        return stored ? parseInt(stored, 10) : 1;
      }
      return 1;
    });

    useEffect(() => {
      setSidebarData(getSidebarDataByRole([user?.role || ""]));
    }, [user?.role]);

    useEffect(() => {
      if (activeItemId !== null) {
        localStorage.setItem("activeSidebarItemId", activeItemId.toString());
      }
    }, [activeItemId]);

    const handleLeafClick = (item: SidebarItem) => {
      setActiveItemId(item.id);
      onLeafItemClick(item);
      navigate(item.url);
    };

    useEffect(() => {
      if (!isMobile) setOpenMobileSideDrawer(false);
    }, [isMobile]);

    const expandedPath =
      activeItemId !== null ? findPathToActiveItem(sidebarData, activeItemId) : [];

    return (
      <>
        {/* Mobile Drawer */}
        <Drawer
          isOpen={openMobileSideDrawer}
          placement="left"
          onClose={() => setOpenMobileSideDrawer(false)}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <SidebarLogo />
            <DrawerBody px={3} py={4}>
              <SidebarAccordion
                items={sidebarData}
                onClick={onItemClick}
                onLeafClick={handleLeafClick}
                activeItemId={activeItemId}
                expandedPath={expandedPath}
              />
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Desktop Sidebar */}
        {!isMobile && (
          <Box
            pos="fixed"
            top={0}
            left={0}
            bottom={0}
            w={isCollapsed ? mediumSidebarWidth : sidebarWidth}
            bg={colorMode === "dark" ? "gray.800" : "white"}
            borderRight="1px solid"
            borderRightColor={useColorModeValue("gray.200", "gray.700")}
            transition="width 0.3s"
            zIndex={1000}
            overflow="hidden"
          >
            {/* Logo/Header */}
            <Box position="sticky" top={0} zIndex={10} bg="inherit">
              <SidebarLogo />
            </Box>

            {/* Main navigation */}
            <Box
              height="calc(100vh - 140px)"
              overflowY="auto"
              className="customScrollBar"
              px={isCollapsed ? 1 : 3}
              py={isCollapsed ? 3 : 2}
            >
              {isCollapsed ? (
                <VStack align="stretch" spacing={1}>
                  {sidebarData.map((item) => (
                    <SidebarPopover
                      key={item.id}
                      item={item}
                      depth={0}
                      onClick={onItemClick}
                      onLeafClick={handleLeafClick}
                      isCollapsed={isCollapsed}
                      activeItemId={activeItemId}
                    />
                  ))}
                </VStack>
              ) : (
                <SidebarAccordion
                  items={sidebarData}
                  onClick={onItemClick}
                  onLeafClick={handleLeafClick}
                  activeItemId={activeItemId}
                  expandedPath={expandedPath}
                />
              )}
            </Box>

            {/* Footer */}
            <Box
              position="absolute"
              bottom={0}
              left={0}
              right={0}
              bg="inherit"
              borderTop="1px solid"
              borderTopColor={useColorModeValue("gray.200", "gray.700")}
              p={isCollapsed ? 3 : 4}
            >
              {isCollapsed ? (
                <VStack align="stretch" spacing={1}>
                  {sidebarFooterData.map((item) => (
                    <SidebarPopover
                      key={item.id}
                      item={item}
                      depth={0}
                      onClick={onItemClick}
                      onLeafClick={handleLeafClick}
                      isCollapsed={isCollapsed}
                      activeItemId={activeItemId}
                    />
                  ))}
                </VStack>
              ) : (
                <SidebarAccordion
                  items={sidebarFooterData}
                  onClick={onItemClick}
                  onLeafClick={handleLeafClick}
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

const findPathToActiveItem = (items: SidebarItem[], activeItemId: number): number[] => {
  const path: number[] = [];

  const find = (items: SidebarItem[], currentPath: number[] = []): boolean => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.id === activeItemId) {
        path.push(...currentPath, i);
        return true;
      }
      if (item.children) {
        if (find(item.children, [...currentPath, i])) return true;
      }
    }
    return false;
  };

  find(items);
  return path;
};

export default SidebarLayout;
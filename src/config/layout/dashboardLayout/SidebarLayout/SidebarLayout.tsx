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
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  useBreakpointValue,
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

const renderIcon = (depth: number, icon: any, isActive: boolean) => {
  const activeColor = "white";
  const inactiveColor = "gray.500";
  const color = isActive ? activeColor : inactiveColor;

  if (depth === 1) return <Text fontSize="lg" mr={2} color={color}>–</Text>;
  if (depth > 1) return <Text fontSize="lg" mr={2} color={color}>◦</Text>;

  return <Icon as={icon.type} boxSize={5} color={color} />;
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
    // const {
    //   themeStore: { themeConfig },
    // } = store;

    // const { colorMode } = useColorMode();
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
              bg="blue.600"
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
                py={depth === 0 ? 3 : 3}
                px={depth === 0 ? 0 : 4}
                bg={itemIsActive ? "transparent" : "transparent"}
                bgGradient={itemIsActive ? "linear(to-r, blue.600, purple.600)" : "none"}
                boxShadow={itemIsActive ? "none" : "none"} // Removed shadow for flat look
                color={itemIsActive ? "white" : "gray.600"}
                fontWeight={itemIsActive ? "semibold" : "medium"}
                _hover={{
                  bg: itemIsActive ? undefined : "gray.50",
                  color: itemIsActive ? "white" : "blue.600",
                }}
                transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                borderRadius="0"
                mx={0}
                mb={0}
                borderRight={itemIsActive ? "none" : "none"}
              >
                {renderIcon(depth, item.icon, itemIsActive)}
                {depth > 0 && (
                  <Flex flex={1} align="center" justify="space-between" pl={3}>
                    <Text fontSize="sm">{item.name}</Text>
                    {item.children?.length ? (
                      <ChevronRightIcon
                        color={itemIsActive ? "white" : "gray.400"}
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
              bg="white"
              borderColor="gray.100"
              _focus={{ outline: "none" }}
              p={0}
            >
              <PopoverArrow bg="white" />
              <PopoverHeader
                bg="gray.50"
                borderBottomWidth="1px"
                borderColor="gray.100"
                py={2}
                px={3}
              >
                <Text fontWeight="semibold" fontSize="sm" color="gray.700">
                  {item.name}
                </Text>
              </PopoverHeader>
              <PopoverBody p={0}>
                <VStack align="stretch" spacing={0}>
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
    // const {
    //   themeStore: { themeConfig },
    // } = store;
    // const { colorMode } = useColorMode();

    const expandedIndex = expandedPath.length > depth ? expandedPath[depth] : null;

    return (
      <Accordion allowMultiple defaultIndex={expandedIndex !== null ? [expandedIndex] : []}>
        {items.map((item) => {
          const isActive = item.id === activeItemId || !!item.children?.some(c => c.id === activeItemId);
          const isExactActive = item.id === activeItemId;

          return (
            <AccordionItem key={item.id} border="none">
              <AccordionButton
                my={0}
                mx={0}
                px={4}
                py={3}
                width="100%"
                borderRadius="0"
                bg={isExactActive ? "transparent" : "transparent"}
                bgGradient={isExactActive ? "linear(to-r, blue.600, purple.600)" : "none"}
                boxShadow={isExactActive ? "none" : "none"}
                color={isActive ? (isExactActive ? "white" : "blue.600") : "gray.600"}
                fontWeight={isActive ? "bold" : "medium"}
                _hover={{
                  bg: isExactActive ? undefined : "gray.50",
                  color: isExactActive ? "white" : "blue.600",
                }}
                transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!item.children?.length) onLeafClick(item);
                  else onClick(item);
                }}
              >
                <Flex align="center" flex="1" gap={3}>
                  {renderIcon(depth, item.icon, isExactActive)}
                  <Text fontSize="sm">{item.name}</Text>
                </Flex>
                {item.children?.length ? <AccordionIcon color={isActive ? (isExactActive ? "white" : "gray.500") : "gray.400"} /> : null}
              </AccordionButton>

              {item.children?.length ? (
                <AccordionPanel pb={1} pl={depth === 0 ? 4 : 8} pr={2}>
                  <Box borderLeft="1px solid" borderColor="gray.100" pl={2}>
                    <SidebarAccordion
                      items={item.children}
                      depth={depth + 1}
                      onClick={onClick}
                      onLeafClick={onLeafClick}
                      activeItemId={activeItemId}
                      expandedPath={expandedPath}
                    />
                  </Box>
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
    // const { colorMode } = useColorMode();

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
    }, [isMobile, setOpenMobileSideDrawer]);

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
          <DrawerContent bg="white">
            <DrawerCloseButton color="gray.500" />
            <Box p={4}>
              <SidebarLogo />
            </Box>
            <DrawerBody px={0} py={2}>
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
            bg="white"
            borderRight="1px solid"
            borderRightColor="gray.100"
            transition="width 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            zIndex={1000}
            overflow="hidden"
            boxShadow="sm"
          >
            {/* Logo/Header */}
            <Box position="sticky" top={0} zIndex={10} bg="white" borderBottom="1px solid" borderColor="gray.100">
              <SidebarLogo />
            </Box>

            {/* Main navigation */}
            <Box
              height="calc(100vh - 140px)"
              overflowY="auto"
              className="customScrollBar"
              px={0}
              py={4}
              sx={{
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  width: '6px',
                  background: "transparent",
                },
                '&::-webkit-scrollbar-thumb': {
                  background: "gray.300",
                  borderRadius: '24px',
                },
              }}
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
              bg="white"
              borderTop="1px solid"
              borderTopColor="gray.100"
              p={3}
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
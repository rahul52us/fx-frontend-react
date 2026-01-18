"use client";

import { Box, Flex, Image, Text, Tooltip } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { dashboard } from "../../../../constant/routes";
import store from "../../../../../store/store";
import { headerHeight } from "../../../../constant/variable";

const SidebarLogo = observer(() => {
  const {
    layout: { isCallapse: isCollapsed }, // ← fixed typo: isCallapse → isCollapsed
    auth: { currentCompanyDetails },
  } = store;

  const navigate = useNavigate();
  const companyName = currentCompanyDetails?.company_name || "FX Platform";

  return (
    <Flex
      as="button" // Makes it more semantically correct + better accessibility
      onClick={() => navigate(dashboard.home)}
      align="center"
      justify={isCollapsed ? "center" : "flex-start"}
      height={headerHeight}
      width="100%"
      px={isCollapsed ? 0 : 4}
      cursor="pointer"
      borderBottom="2px"
      transition="all 0.3s ease"
      _hover={{ bg: "rgba(0,0,0,0.03)" }}
      _active={{ bg: "rgba(0,0,0,0.06)" }}
      role="group"
    >
      <Flex
        align="center"
        gap={isCollapsed ? 0 : 3}
        maxW="100%"
      >
        {/* Logo Image */}
        <Box
          position="relative"
          flexShrink={0}
        >
          <Image
            src="https://images.seeklogo.com/logo-png/47/1/fx-logo-png_seeklogo-477744.png"
            alt={`${companyName} logo`}
            fallbackSrc="https://via.placeholder.com/40?text=FX" // Better fallback
            boxSize={isCollapsed ? "36px" : "40px"}
            objectFit="contain"
            borderRadius="full"
            border="2px solid"
            borderColor="whiteAlpha.400"
            boxShadow="sm"
            transition="transform 0.2s ease"
            _groupHover={{ transform: "scale(1.05)" }}
          />
        </Box>

        {/* Company Name - only shown when NOT collapsed */}
        {!isCollapsed && (
          <Tooltip
            label={companyName}
            hasArrow
            placement="right"
            openDelay={500}
            bg="gray.800"
            color="white"
            fontSize="sm"
            px={3}
            py={2}
            borderRadius="md"
          >
            <Text
              fontSize="lg"
              fontWeight="600"
              letterSpacing="wide"
              color="gray.800"
              _dark={{ color: "whiteAlpha.900" }}
              noOfLines={1}
              maxW="160px"
              isTruncated
            >
              {companyName}
            </Text>
          </Tooltip>
        )}

        {/* Collapsed mode - simple "FX" text */}
        {/* {isCollapsed && (
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="blue.600"
            _dark={{ color: "blue.300" }}
            letterSpacing="tight"
          >
            FX
          </Text>
        )} */}
      </Flex>
    </Flex>
  );
});

export default SidebarLogo;
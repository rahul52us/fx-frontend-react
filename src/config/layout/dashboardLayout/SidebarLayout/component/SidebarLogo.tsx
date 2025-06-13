import {
  Box,
  Flex,
  Image,
  Text,
  useColorModeValue,
  Tooltip,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { dashboard } from "../../../../constant/routes";
import store from "../../../../../store/store";
import { headerHeight } from "../../../../constant/variable";

const SidebarLogo = observer(() => {
  const {
    layout: { isCallapse },
    themeStore: { themeConfig },
    auth: { currentCompanyDetails },
  } = store;
  const navigate = useNavigate();

  return (
    <Flex
      bgColor={useColorModeValue(
        themeConfig.colors.custom.light.primary,
        themeConfig.colors.custom.dark.primary
      )}
      justifyContent={isCallapse ? "center" : undefined}
      flexDirection={isCallapse ? "column" : undefined}
      alignItems="center"
      height={headerHeight}
    >
      <Box
        cursor="pointer"
        display="flex"
        alignItems="center"
        justifyContent="center"
        onClick={() => navigate(dashboard.home)}
      >
        {isCallapse ? (
          <Text fontWeight={600} fontSize="lg">
            {`${currentCompanyDetails?.company_name
              ?.charAt(0)
              .toUpperCase()}.${currentCompanyDetails?.company_name
              ?.slice(-1)
              .toUpperCase()}`}
          </Text>
        ) : (
          <Flex alignItems="center" columnGap={4} maxW="100%" px={2} ml={3}>
            {/* Company Logo with fallback and dynamic sizing */}
            <Image
              borderRadius="full" // Optional: Adds a rounded look to the logo
              boxSize={isCallapse ? "35px" : "50px"} // Dynamic size based on isCallapse
              objectFit="contain" // Ensures the image fits well in the container
              src={
                currentCompanyDetails?.logo?.url || "/path/to/fallback-logo.png"
              } // Fallback image
              alt={currentCompanyDetails?.company_name || "Company Logo"}
              fallbackSrc="/path/to/fallback-logo.png" // Image to show while loading or if the src is invalid
              boxShadow="md" // Optional: Adds a subtle shadow to make the logo stand out
            />
            {/* Truncated Company Name with Tooltip */}
            <Tooltip
              label={currentCompanyDetails?.company_name}
              hasArrow
              isDisabled={currentCompanyDetails?.company_name.length <= 15}
            >
              <Text
                textAlign="center"
                fontSize="md"
                fontWeight="500"
                noOfLines={1}
                maxW="180px" // Set a maximum width to avoid overflow
                isTruncated
              >
                {currentCompanyDetails?.company_name}
              </Text>
            </Tooltip>
          </Flex>
        )}
      </Box>
    </Flex>
  );
});

export default SidebarLogo;

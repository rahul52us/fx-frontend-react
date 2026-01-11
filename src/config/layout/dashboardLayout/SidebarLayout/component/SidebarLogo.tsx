import {
  Box,
  Flex,
  Image,
  Text,
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
    auth: { currentCompanyDetails },
  } = store;
  const navigate = useNavigate();

  return (
    <Flex
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
             Fx
          </Text>
        ) : (
          <Flex alignItems="center" columnGap={4} maxW="100%" px={2} ml={3}>
            {/* Company Logo with fallback and dynamic sizing */}
            <Image
              borderRadius="full" // Optional: Adds a rounded look to the logo
              boxSize={isCallapse ? "35px" : "35px"} // Dynamic size based on isCallapse
              objectFit="contain" // Ensures the image fits well in the container
              src={
                "https://images.seeklogo.com/logo-png/47/1/fx-logo-png_seeklogo-477744.png"
              } // Fallback image
              alt={currentCompanyDetails?.company_name || "Company Logo"}
              fallbackSrc="/path/to/fallback-logo.png" // Image to show while loading or if the src is invalid
              boxShadow="md" // Optional: Adds a subtle shadow to make the logo stand out
            />
            {/* Truncated Company Name with Tooltip */}
            <Tooltip
              label={"FX"}
              hasArrow
            >
              <Text
                textAlign="center"
                fontSize="md"
                fontWeight="500"
                noOfLines={1}
                maxW="180px" // Set a maximum width to avoid overflow
                isTruncated
              >
                FX
              </Text>
            </Tooltip>
          </Flex>
        )}
      </Box>
    </Flex>
  );
});

export default SidebarLogo;

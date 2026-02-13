import {
  Box,
  Flex,
  Heading,
  // Image,
  Text,
  useBreakpointValue,
  // keyframes,
} from "@chakra-ui/react";
// import IconArrowImg from "../../../config/assets/icon_images/icon-arrow-img.svg";
import { observer } from "mobx-react-lite";
import store from "../../../store/store";
import AdminUserSelect from "../mainDashboard/adminDashboard/components/AdminUserSelect";

// const getRandomRotation = (index: number) => {
//   const rotations = [45, 240, 270];
//   return `rotate(${rotations[index]}deg)`;
// };

// Define a keyframe animation for the icon hover effect
// const bounce = keyframes`
//   0%, 100% {
//     transform: translateY(0);
//   }
//   50% {
//     transform: translateY(-10px);
//   }
// `;

const DashboardBanner = observer(() => {
  const {
    auth: { user },
  } = store;

  const fontSize = useBreakpointValue({
    xl: "3xl",
    lg: "2xl",
    md: "xl",
    sm: "lg",
    base: "md",
  });




  return (
    <Box
      p={{ base: 6, md: 8 }}
      mt={4}
      mb={6}
      borderRadius="2xl"
      bgGradient="linear(to-r, blue.600, purple.600)"
      boxShadow="xl"
      position="relative"
      overflow="hidden"
      color="white"
    >
      {/* Decorative Circles */}
      <Box
        position="absolute"
        top="-50%"
        left="-10%"
        w="400px"
        h="400px"
        bg="whiteAlpha.100"
        borderRadius="full"
      />
      <Box
        position="absolute"
        bottom="-30%"
        right="-5%"
        w="300px"
        h="300px"
        bg="whiteAlpha.100"
        borderRadius="full"
      />

      <Flex
        direction={{ base: "column", md: "row" }}
        alignItems={{ base: "flex-start", md: "center" }}
        justifyContent="space-between"
        gap={6}
        position="relative"
        zIndex={1}
      >
        <Flex direction="column">
          <Heading
            fontSize={fontSize}
            fontWeight="800"
            letterSpacing="tight"
            color="white"
            textShadow="0 2px 10px rgba(0,0,0,0.2)"
          >
            Welcome back, {user?.basicDetails?.name?.split(" ")[0] || user?.basicDetails?.email?.split("@")[0]} 👋
          </Heading>
          <Text
            mt={2}
            fontSize={{ base: "md", md: "lg" }}
            color="whiteAlpha.800"
            fontWeight="500"
          >
            Here’s your financial overview for today. Let's make it count.
          </Text>
        </Flex>

        <Box w={{ base: "100%", md: "auto" }}>
          <AdminUserSelect />
        </Box>
      </Flex>
    </Box>
  );
});

export default DashboardBanner;

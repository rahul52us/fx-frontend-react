import {
  Box,
  Flex,
  Heading,
  Image,
  Text,
  useBreakpointValue,
  useColorModeValue,
  keyframes,
} from "@chakra-ui/react";
import IconArrowImg from "../../../config/assets/icon_images/icon-arrow-img.svg";
import { observer } from "mobx-react-lite";
import store from "../../../store/store";

const getRandomRotation = (index: number) => {
  const rotations = [45, 240, 270];
  return `rotate(${rotations[index]}deg)`;
};

// Define a keyframe animation for the icon hover effect
const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

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

  const isLargerThanXl = useBreakpointValue({ lg: true });

  return (
    <Box
      bgGradient={useColorModeValue(
        "linear(to-r, rgb(199, 210, 254), rgb(147, 197, 253))",
        "linear(to-r, #4F46E5, #4338CA)"
      )}
      p={isLargerThanXl ? 6 : 4}
      mt={isLargerThanXl ? 1.2 : 1.5}
      borderRadius={8}
      mb={isLargerThanXl ? 5 : 3}
      boxShadow="md" // Added shadow for depth
      transition="background 0.3s ease"
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Flex direction="column">
          <Heading
            fontSize={fontSize}
            color={useColorModeValue("gray.800", "white")}
          >
            Welcome, {user.name} 👋
          </Heading>
          <Text mt={2} color={useColorModeValue("gray.600", "gray.300")}>
            Here’s your daily overview—let’s make it a great one!
          </Text>
        </Flex>
        {isLargerThanXl && (
          <Flex ml={5}>
            {[0, 1, 2].map((index) => (
              <Image
                key={index}
                src={IconArrowImg}
                alt=""
                w={70}
                h={70}
                ml={index === 0 ? 0 : 5}
                transform={getRandomRotation(index)}
                display="block"
                _hover={{
                  animation: `${bounce} 0.5s ease-in-out`, // Bounce effect on hover
                  transform: "scale(1.1)",
                }}
                transition="transform 0.2s"
              />
            ))}
          </Flex>
        )}
      </Flex>
    </Box>
  );
});

export default DashboardBanner;

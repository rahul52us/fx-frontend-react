import { Box, Flex, Icon, Text, Spinner } from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { darkenHex, primaryColor } from "../../../globalColors";

const NewWidgetCard = ({
  totalCount,
  title,
  loading,
  icon,
  handleClick,
  bg
}: {
  totalCount: number;
  title: string;
  handleClick: () => void; // Specify type for handleClick
  loading: boolean;
  icon: any;
  bg:string
}) => {
  const [count, setCount] = useState(0);

  // Define background colors for light and dark mode
  // const cardBg = useColorModeValue("white", "#2D3748"); // White for light, dark gray for dark
  const textColor = useColorModeValue("gray.800", "gray.200");
  // const countColor = useColorModeValue("blue.600", "cyan.400");
  const descriptionColor = useColorModeValue("gray.600", "gray.300");

  const intervalDelay = 5;

  useEffect(() => {
    const interval = setInterval(() => {
      if (count < totalCount) {
        setCount((prevCount) => prevCount + 1); // Use functional state update for better performance
      }
    }, intervalDelay);

    return () => clearInterval(interval);
  }, [count, totalCount]);

  return (
    <Box
      position="relative"
      onClick={handleClick}
      p={4}
      rounded="xl"
      // shadow="md"
      bg={bg}
      _hover={{
        transform: "scale(1.02)",
      }} // Lighter background on hover
      transition="all 0.3s ease"
      cursor="pointer"
      w="full"
      borderWidth={1} // Optional: adds a border for better visual separation
      borderColor={darkenHex(bg, 0.2)} // Border color based on theme
    >
      {loading && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          // bg="rgba(255, 255, 255, 0.5)" // Slightly transparent white
          zIndex={1}
          rounded="xl"
        >
          <Spinner thickness="4px" size="xl" color={primaryColor} />
        </Box>
      )}

      <Flex align="center" columnGap={5} justifyContent="space-around">
        {/* Icon on the left */}
        <Box mr={4}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection={"column"}
          >
            <Box
              rounded="full"
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}             
              w={16}
              h={16}
            >
              <Icon as={icon} w={50} h={50}   color={darkenHex(bg, 0.2)} />
            </Box>
            <Text color={textColor}  fontSize="lg" style={{fontWeight:"400"}}>
              {title}
            </Text>
          </Box>
        </Box>

        {/* Text on the right */}
        <Box>
          <Text  color={darkenHex(bg, 0.2)} fontWeight="bold" fontSize="4xl" >
            {count < totalCount ? count : totalCount}
          </Text>
          <Text color={descriptionColor} fontSize="sm">
            Total {title.toLowerCase()}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default NewWidgetCard;

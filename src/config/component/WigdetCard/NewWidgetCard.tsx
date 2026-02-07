import { Box, Flex, Icon, Text, Spinner, SimpleGrid, Badge } from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { darkenHex, primaryColor } from "../../../globalColors";

const NewWidgetCard = ({
  totalCount,
  title,
  loading,
  icon,
  handleClick,
  bg,
  pending = 0,
  approved = 0,
  rejected = 0,
}: {
  totalCount: number;
  title: string;
  handleClick: () => void;
  loading: boolean;
  icon: any;
  bg: string;
  pending?: number | string;
  approved?: number | string;
  rejected?: number | string;
}) => {
  const [count, setCount] = useState(0);

  const descriptionColor = useColorModeValue("gray.600", "gray.300");

  const intervalDelay = 5;

  useEffect(() => {
    const interval = setInterval(() => {
      if (count < totalCount) {
        setCount((prevCount) => prevCount + 1);
      }
    }, intervalDelay);

    return () => clearInterval(interval);
  }, [count, totalCount]);

  const StatItem = ({ label, value, colorScheme }: any) => (
    <Flex direction="column" align="center" justify="center" p={1} borderRadius="md" _hover={{ bg: "whiteAlpha.500" }}>
      <Badge colorScheme={colorScheme} variant="subtle" fontSize="0.65rem" px={2} borderRadius="full" mb={1}>
        {label}
      </Badge>
      <Text fontSize="md" fontWeight="700" color="gray.700">
        {value}
      </Text>
    </Flex>
  );

  return (
    <Box
      position="relative"
      onClick={handleClick}
      p={5}
      rounded="2xl"
      bg={bg}
      boxShadow="sm"
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: "xl",
        borderColor: darkenHex(bg, 0.3),
      }}
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      cursor="pointer"
      w="full"
      borderWidth={1}
      borderColor={darkenHex(bg, 0.15)}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minH="180px"
      overflow="hidden"
    >
      {/* Decorative background circle */}
      <Box
        position="absolute"
        top="-20px"
        right="-20px"
        w="100px"
        h="100px"
        bg="whiteAlpha.400"
        borderRadius="full"
        zIndex={0}
      />

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
          zIndex={10}
          rounded="2xl"
          bg="rgba(255,255,255,0.7)"
          backdropFilter="blur(2px)"
        >
          <Spinner thickness="4px" size="xl" color={primaryColor} />
        </Box>
      )}

      <Flex align="flex-start" justifyContent="space-between" mb={6} zIndex={1}>
        <Box
          rounded="xl"
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          w={14}
          h={14}
          bg="white"
          boxShadow="md"
          color={darkenHex(bg, 0.5)}
        >
          <Icon as={icon} w={7} h={7} />
        </Box>
        <Box textAlign="right">
          <Text color={darkenHex(bg, 0.6)} fontWeight="800" fontSize="4xl" lineHeight="1">
            {count < totalCount ? count : totalCount}
          </Text>
          <Text color={descriptionColor} fontSize="sm" fontWeight="600" letterSpacing="wide" mt={1}>
            {title}
          </Text>
        </Box>
      </Flex>

      <Box
        bg="whiteAlpha.600"
        borderRadius="xl"
        p={2}
        mt="auto"
        zIndex={1}
        backdropFilter="blur(5px)"
      >
        <SimpleGrid columns={3} spacing={2}>
          <StatItem label="PENDING" value={pending} colorScheme="orange" />
          <StatItem label="APPROVED" value={approved} colorScheme="green" />
          <StatItem label="REJECTED" value={rejected} colorScheme="red" />
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default NewWidgetCard;

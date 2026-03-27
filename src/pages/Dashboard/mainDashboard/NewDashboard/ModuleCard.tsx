import { Box, Flex, Text } from "@chakra-ui/react";
import { FiArrowRight } from "react-icons/fi";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: any;
  count: number;
  color: string;     // e.g. "blue.500"
  bg: string;        // e.g. "blue.100"
  onClick?: () => void;
  delay?: number;
}

const ModuleCard = ({
  title,
  description,
  icon: Icon,
  count,
  color,
  bg,
  onClick,
  delay = 0
}: ModuleCardProps) => {
  return (
    <Box
      position="relative"
      p="5"
      borderRadius="xl"
      cursor="pointer"
      bg="white"
      boxShadow="sm"
      transition="all 0.3s"
      overflow="hidden"
      animation={`fadeInUp 0.4s ease forwards`}
      sx={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
      _hover={{
        boxShadow: "lg",
        transform: "translateY(-4px)"
      }}
      role="group"
    >
      <Flex align="center" gap="4">
        {/* Icon */}
        <Box
          p="3"
          borderRadius="xl"
          bg={bg}
          transition="transform 0.3s"
          _groupHover={{ transform: "scale(1.1)" }}
        >
          <Box as={Icon} boxSize="5" color={color} />
        </Box>

        {/* Text */}
        <Box flex="1" minW="0">
          <Text fontWeight="semibold" color="gray.800">
            {title}
          </Text>
          <Text fontSize="xs" color="gray.500" mt="0.5" noOfLines={1}>
            {description}
          </Text>
        </Box>

        {/* Count + Arrow */}
        <Flex align="center" gap="2">
          <Text fontSize="sm" fontWeight="bold" color={color}>
            {count}
          </Text>

          <Box
            as={FiArrowRight}
            boxSize="4"
            color="gray.400"
            opacity="0"
            transform="translateX(-8px)"
            transition="all 0.3s"
            _groupHover={{
              opacity: 1,
              transform: "translateX(0)"
            }}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default ModuleCard;
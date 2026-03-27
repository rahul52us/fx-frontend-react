import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { IconType } from "react-icons";

interface KpiCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: IconType;
  color: string;   // e.g. "blue.500"
  bg: string;      // e.g. "blue.100"
  delay?: number;
  onClick?: () => void;
}

const KpiCard = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  color,
  bg,
  delay = 0,
  onClick
}: KpiCardProps) => {
  const getChangeColor = () => {
    if (changeType === "positive") return "green.500";
    if (changeType === "negative") return "red.500";
    return "gray.500";
  };

  return (
    <Box
      position="relative"
      overflow="hidden"
      p="5"
      borderRadius="xl"
      bg="white"
      cursor="pointer"
      boxShadow="sm"
      transition="all 0.3s"
      animation={`fadeInUp 0.4s ease forwards`}
      sx={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
      _hover={{
        boxShadow: "lg",
        transform: "translateY(-4px)"
      }}
    >
      <Flex align="flex-start" justify="space-between">
        {/* Left Content */}
        <VStack align="start" spacing="2">
          <Text fontSize="sm" fontWeight="medium" color="gray.500">
            {title}
          </Text>

          <Text
            fontSize="2xl"
            fontWeight="bold"
            letterSpacing="tight"
            color="gray.800"
          >
            {value}
          </Text>

          {change && (
            <Text fontSize="xs" fontWeight="medium" color={getChangeColor()}>
              {change}
            </Text>
          )}
        </VStack>

        {/* Icon */}
        <Box p="3" borderRadius="xl" bg={bg}>
          <Box as={Icon} boxSize="5" color={color} />
        </Box>
      </Flex>
    </Box>
  );
};

export default KpiCard;
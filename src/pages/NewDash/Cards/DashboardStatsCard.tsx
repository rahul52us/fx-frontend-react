import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";

interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  iconBgColor?: string;
  iconColor?: string;
  trendValue: number;
}

export default function DashboardStatsCard({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
  trendValue,
}: DashboardCardProps) {
  const trendColor = trendValue > 0 ? "green.400" : "red.400";
  const trendText =
    trendValue > 0 ? "Up from yesterday" : "Down from yesterday";

  return (
    <Box
      p={{ base: 3, md: 5 }}
      rounded={"2xl"}
      shadow={"md"}
      borderWidth={1}
      bg={"white"}
      
    >
      <Flex justify={"space-between"}>
        <Box>
          <Text color={"gray"} fontWeight={500} fontSize={{ base: "sm", md: "md" }}>
            {title}
          </Text>
          <Text
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight={500}
            mt={{ base: 1, md: 2 }}
          >
            {value}
          </Text>
        </Box>
        <Icon
          boxSize={{ base: 10, md: 12 }}
          color={iconColor}
          as={icon}
          bg={iconBgColor}
          p={2}
          rounded={"35%"}
        />
      </Flex>
      <Flex align={"center"} mt={3} gap={{ base: 2, md: 3 }}>
        <Icon
          boxSize={{ base: 5, md: 6 }}
          as={trendValue > 0 ? FaArrowTrendUp : FaArrowTrendDown}
          color={trendColor}
        />
        <Text color={trendColor} fontWeight={500} fontSize={{ base: "sm", md: "md" }}>
          {trendValue}%
        </Text>
        <Text
          fontSize={{ base: "xs", md: "sm" }}
          color={"gray"}
          fontWeight={500}
        >
          {trendText}
        </Text>
      </Flex>
    </Box>
  );
}

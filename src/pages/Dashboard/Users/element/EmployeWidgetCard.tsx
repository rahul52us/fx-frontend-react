import { Flex, Box, Text, Skeleton, useColorMode } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { CardPropsI } from "../utils/constant.interface";


export default function DashboardCard({
  title,
  value,
  link,
  loading = false,
  icon: Icon,
}: CardPropsI) {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  return title ? (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      cursor="pointer"
      transition="all .2s ease-in-out"
      bg={colorMode === "light" ? "teal.50" : "gray.700"}
      color={colorMode === "light" ? "teal.500" : "gray.200"}
      boxShadow="rgb(0 0 0 / 20%) 0px 0px 11px"
      borderRadius="10px"
      p=".6rem 1rem"
      _hover={{
        transform: "scale(1.01)",
        boxShadow: "rgb(0 0 0 / 20%) 0px 0px 11px",
      }}
      h={90}
    >
      <Box>
        <Skeleton
          mt={-5}
          isLoaded={!loading}
          h={4}
          startColor={colorMode === "light" ? "teal.50" : "gray.800"}
          endColor={colorMode === "light" ? "teal.100" : "gray.700"}
        >
          <Text
            fontSize="sm"
            mb={0}
            fontWeight="500"
            textTransform="capitalize"
            cursor="pointer"
            onClick={() => {
              if (link) {
                navigate(link);
              }
            }}
          >
            {title}
          </Text>
          <Text fontSize="lg" fontWeight="700">
            {value}
          </Text>
        </Skeleton>
      </Box>
      <Flex
        alignItems="center"
        justifyContent="center"
        bg={colorMode === "light" ? "teal.400" : "gray.600"}
        color="white"
        w="3rem"
        h="3rem"
        rounded="full"
      >
        <Icon size={30} />
      </Flex>
    </Flex>
  ) : null;
}

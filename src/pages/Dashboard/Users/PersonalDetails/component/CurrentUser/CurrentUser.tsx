import {
  Box,
  Grid,
  Avatar,
  Text,
  useColorModeValue,
  Flex,
  Tag,
} from "@chakra-ui/react";

interface User {
  _id: string;
  username: string;
  name: string;
  code: string;
  title: string;
  designation?: { title: string }[];
  pic?: { url?: string };
}

const CurrentUser = ({ userData }: { userData: User }) => {
  return (
    <Box
      maxW="md"
      p={4}
      shadow="md"
      rounded="lg"
      bg={useColorModeValue("white", "gray.800")}
      borderWidth={1}
      borderColor={useColorModeValue("gray.200", "gray.600")}
      transition="all 0.3s ease"
      _hover={{
        shadow: "lg",
        borderColor: useColorModeValue("gray.300", "gray.500"),
        transform: "scale(1.02)",
      }}
    >
      <Grid templateColumns="80px 1fr" gap={4} alignItems="center">
        <Avatar
          size="lg"
          name={userData.name}
          src={userData.pic?.url || "https://via.placeholder.com/80?text=No+Image"}
          borderRadius="md"
        />
        <Box>
          <Text fontWeight="bold" fontSize="lg" color={useColorModeValue("gray.800", "gray.100")}>
            {userData.name}
          </Text>
          <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
            {userData.username}
          </Text>
          <Flex mt={2} gap={2}>
            <Tag colorScheme="teal" size="md" variant="solid">
              {userData.code}
            </Tag>
            {userData.designation && userData.designation.length > 0 && (
              <Tag colorScheme="teal" size="md" variant="solid">
                {userData.designation[0]?.title}
              </Tag>
            )}
          </Flex>
        </Box>
      </Grid>
    </Box>
  );
};

export default CurrentUser;

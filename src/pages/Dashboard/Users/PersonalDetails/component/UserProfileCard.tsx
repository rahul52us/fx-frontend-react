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
  designation?: string;
  pic?: { url?: string };
}

const UserProfileCard = ({
  userData,
  designation,
}: {
  userData: User;
  designation?: string;
}) => {
  return (
    <Box
      maxW="sm"
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
      <Grid templateColumns="60px 1fr" gap={4} alignItems="center">
        <Avatar
          name={userData.name}
          src={userData.pic?.url || "https://via.placeholder.com/60?text=No+Image"}
          size="md"
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
            {designation && (
              <Tag colorScheme="teal" size="md" variant="solid">
                {designation}
              </Tag>
            )}
          </Flex>
        </Box>
      </Grid>
    </Box>
  );
};

export default UserProfileCard;

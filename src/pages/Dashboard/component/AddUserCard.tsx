
import { Avatar, Button, Flex, Text, VStack, Box } from "@chakra-ui/react";

const AddUserCard = ({userData}:any) => {
  return (
    <div>
         <VStack
      alignItems="center"
      justifyContent="center"
      maxW="md"
      boxShadow="rgb(0 0 0 / 20%) 0px 0px 8px"
      borderRadius="lg"
      spacing={4}
      p={"2rem"}
    >
      {userData.map((user:any) => (
        <Flex key={user.id} alignItems="center" width="100%" gap={6}>
          <Box>
            <Avatar name={user.name} src={user.avatarSrc} />
          </Box>
          <VStack alignItems="flex-start" flex="1">
            <Text fontSize="xl" fontWeight="bold" textAlign="center">
              {user.name}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {user.access}
            </Text>
          </VStack>
        </Flex>
      ))}
      <Button colorScheme="cyan" alignSelf="center" borderRadius={"50px"}>
        Add User
      </Button>
    </VStack>
      
    </div>
  )
}

export default AddUserCard

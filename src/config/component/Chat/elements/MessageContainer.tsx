import { Avatar, Box, Text, Flex, Spacer } from "@chakra-ui/react";
import MessageDotOption from "./MessageDotOption";
import {
  litePrimaryColor,
  primaryColor,
  textColor,
  whiteTextColor,
} from "../../../../globalColors";

const MessageContainer = ({ user }: any) => {
  return (
    <>
      <Text fontSize={12} color={textColor} textAlign={user.me ? "right" : "left"} mb={2} >
        {user.createdAt}
      </Text>

      <Flex
        justifyContent={user.me ? "flex-end" : "flex-start"}
        alignItems="end"
        marginBottom={4}
        position="relative"
      >
        {!user.me && 
        <Avatar
          name={user.name}
          src={user.avatar}
          size={["sm"]}
          marginRight={2}
        />
        }
        <Box
          backgroundColor={user.me ? primaryColor : litePrimaryColor }
          borderRadius="lg"
          p={3}
          maxWidth="70%"
          width="100%"
          position="relative"
        >
          <Flex alignItems="flex-start" marginBottom={1}>
            <Box flexDirection={"column"}>
              <Text
                fontWeight="bold"
                marginRight={2}
                fontSize={11}
                color={user.me ?whiteTextColor: textColor}
              >
                {user.name}
              </Text>
            </Box>
            <Spacer />
            <Box position="relative">
              <MessageDotOption user={user}/>
            </Box>
          </Flex>
          <Text fontSize="sm" color={user.me ?whiteTextColor: textColor} mt={-1}>
            {user.message}
          </Text>
        </Box>
        {user.me && 
        <Avatar
          name={user.name}
          src={user.avatar}
          size={["sm"]}
          marginLeft={2}
        />
        }
      </Flex>
    </>
  );
};

export default MessageContainer;

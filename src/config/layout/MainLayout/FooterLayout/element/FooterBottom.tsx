import {
  Box,
  Divider,
  Flex,
  Grid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import LinkText from "../../../../component/LinkText/LinkText";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { authentication } from "../../../../constant/routes";
import store from "../../../../../store/store";

const FooterBottom = observer(() => {
  const {
    auth: { user, doLogout },
  } = store;
  const navigate = useNavigate();
  return (
    <Box mt={5}>
      <Divider borderColor={useColorModeValue("gray.500", "gray.600")} />
      <Grid templateColumns={{ base: "1fr", md: "1.5fr 1fr" }} pt={5} pb={5}>
        <Box
          display={"flex"}
          justifyContent={{ base: "center", md: "flex-start" }}
          alignItems={"center"}
          gap={2}
          cursor={"pointer"}
          fontSize={{ base: 12, sm: 14 }}
        >
          <Text mr={1} color={useColorModeValue("gray.500", "gray.300")}>
            Copyright © 2023
          </Text>
          <LinkText text="Edukateus " />
          <Text ml={1.5} color={useColorModeValue("gray.500", "gray.300")}>
            All Rights Reserved
          </Text>
        </Box>
        <Flex
          justifyContent={"space-around"}
          flexFlow={"wrap"}
          mt={{ base: 4, sm: 4, md: 0 }}
          fontSize={{ base: 12, sm: 14 }}
        >
          <LinkText text="Terms Of Condition" />
          <LinkText text="Privacy Policy" />
          <LinkText text="Subscription" />
          {user ? (
            <LinkText
              text="Logout from site"
              clickEvent={() => {
                doLogout();
                navigate(authentication.login);
              }}
            />
          ) : (
            <LinkText
              text="Login & Register"
              clickEvent={() => {
                navigate(authentication.login);
              }}
            />
          )}
        </Flex>
      </Grid>
    </Box>
  );
});

export default FooterBottom;

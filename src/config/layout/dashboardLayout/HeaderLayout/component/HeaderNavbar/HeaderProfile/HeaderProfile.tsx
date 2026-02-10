import {
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Divider,
  Box,
  Text,
  VStack,
  Icon,
  Portal,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import store from "../../../../../../../store/store";
import { useLocation, useNavigate } from "react-router-dom";
import { authentication, main } from "../../../../../../constant/routes";
import {
  FaLock,
  FaPalette,
  FaSignOutAlt,
  FaUser,
  FaKey,
  FaHome,
} from "react-icons/fa";

const HeaderProfile = observer(() => {
  const { pathname } = useLocation();
  const {
    auth: { user, doLogout },
    themeStore: { setOpenThemeDrawer },
  } = store;
  const navigate = useNavigate();

  return user ? (
    <Menu closeOnSelect={false} placement="bottom-end">
      <MenuButton
        as={IconButton}
        aria-label="User Menu"
        icon={
          <Avatar
            src={user?.pic?.url || undefined}
            size="md"
            name={user?.basicDetails?.email}
            bg="blue.500"
            color="white"
            border="2px solid white"
            shadow="md"
            sx={{
              '& > div': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: '1',
                fontSize: '1rem',
              }
            }}
          />
        }
        marginLeft={"20px"}
        size="md"
        variant="ghost"
        _hover={{ bg: "transparent", transform: "scale(1.05)" }}
        _active={{ bg: "transparent", transform: "scale(0.95)" }}
        transition="all 0.2s"
      />
      <Portal>
        <MenuList
          minWidth="260px"
          maxWidth="280px"
          boxShadow="xl"
          borderRadius="lg"
          zIndex={9999}
          p={0}
          border="1px solid"
          borderColor="gray.200"
          overflow="hidden"
        >
          <VStack spacing={0} align="stretch">
            <Box textAlign="center" py={4} px={4} bg="gray.50">
              <Avatar
                src={user?.pic?.url || undefined}
                size="xl"
                name={user?.userName}
                mb={3}
                border="3px solid white"
                shadow="md"
                mx="auto"
                sx={{
                  '& > div': {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: '1',
                    fontSize: '1.5rem',
                  }
                }}
              />
              <Text fontWeight="bold" fontSize="lg" mb={1}>
                {user?.userName}
              </Text>
              <Text fontSize="xs" color="gray.600" mb={2}>
                @{user?.basicDetails?.email?.split('@')[0]}
              </Text>
              {user?.role && (
                <Text
                  fontSize="xs"
                  px={3}
                  py={1}
                  bg="blue.500"
                  color="white"
                  borderRadius="full"
                  display="inline-block"
                  fontWeight="semibold"
                  textTransform="capitalize"
                  shadow="sm"
                >
                  {user.role}
                </Text>
              )}
            </Box>
            <Divider />
            <Box px={2} py={2}>
              {user && pathname !== main.home && (
                <MenuItem
                  onClick={() => navigate(main.home)}
                  borderRadius="md"
                  _hover={{ bg: "blue.50", color: "blue.600" }}
                  py={2.5}
                  mb={1}
                >
                  <FaHome style={{ marginRight: "10px" }} /> Dashboard
                </MenuItem>
              )}
              <MenuItem
                onClick={() => navigate(main.changePassword)}
                borderRadius="md"
                _hover={{ bg: "blue.50", color: "blue.600" }}
                py={2.5}
                mb={1}
              >
                <FaLock style={{ marginRight: "10px" }} /> Change Password
              </MenuItem>
              <MenuItem
                onClick={setOpenThemeDrawer}
                borderRadius="md"
                _hover={{ bg: "blue.50", color: "blue.600" }}
                py={2.5}
              >
                <FaPalette style={{ marginRight: "10px" }} /> Customize Theme
              </MenuItem>
            </Box>
            <Divider />
            <Box px={2} py={2}>
              <MenuItem
                onClick={() => {
                  doLogout();
                  navigate(authentication.login);
                }}
                borderRadius="md"
                color="red.600"
                fontWeight="medium"
                _hover={{ bg: "red.50" }}
                py={2.5}
              >
                <FaSignOutAlt style={{ marginRight: "10px" }} /> Logout
              </MenuItem>
            </Box>
          </VStack>
        </MenuList>
      </Portal>
    </Menu>
  ) : (
    <Menu closeOnSelect={false} placement="bottom-end">
      <MenuButton
        as={IconButton}
        aria-label="User Menu"
        icon={<Avatar size="sm" borderRadius="full" />}
        size="sm"
        variant="ghost"
      />
      <Portal>
        <MenuList
          minWidth="220px"
          boxShadow="xl"
          borderRadius="lg"
          zIndex={9999}
          p={2}
          border="1px solid"
          borderColor="gray.200"
        >
          <VStack spacing={2}>
            <MenuItem
              onClick={() => navigate(authentication.login)}
              display="flex"
              alignItems="center"
              borderRadius="md"
              _hover={{ bg: "blue.50", color: "blue.600" }}
            >
              <Icon as={FaUser} boxSize={5} mr={2} />
              <Text>Login</Text>
            </MenuItem>
            <MenuItem
              onClick={() => navigate(authentication.createOrganisationStep1)}
              display="flex"
              alignItems="center"
              borderRadius="md"
              _hover={{ bg: "blue.50", color: "blue.600" }}
            >
              <Icon as={FaKey} boxSize={5} mr={2} />
              <Text>Create New Account</Text>
            </MenuItem>
          </VStack>
        </MenuList>
      </Portal>
    </Menu>
  );
});

export default HeaderProfile;
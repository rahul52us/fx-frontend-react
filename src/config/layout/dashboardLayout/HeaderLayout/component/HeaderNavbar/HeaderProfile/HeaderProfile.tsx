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
  FaCog,
  FaLock,
  FaPalette,
  FaSignOutAlt,
  FaUser,
  FaKey,
  FaHome,
} from "react-icons/fa";

const HeaderProfile = observer(() => {
  const {auth : {currentCompanyDetails}} = store
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
            size="sm"
            borderRadius={10}
            name={user?.name}
          />
        }
        size="sm"
        variant="ghost"
      />
      <Portal>
        <MenuList
          minWidth="220px"
          boxShadow="md"
          borderRadius="md"
          zIndex={10}
          p={2}
        >
          <VStack spacing={2}>
            <Box textAlign="center">
              <Avatar src={user?.pic?.url || undefined} size="lg" name={user?.name} />
              <Text mt={2} fontWeight="bold">
                {user?.name}
              </Text>
              <Text mt={0.5} fontWeight="xl" fontSize="sm" cursor="pointer">{currentCompanyDetails?.company_name}</Text>
            </Box>
            <Divider />
            {user && pathname !== main.home && (
              <MenuItem onClick={() => navigate(main.home)}>
                <FaHome style={{ marginRight: "8px" }} /> Home
              </MenuItem>
            )}
            <MenuItem onClick={() => navigate(main.profile)}>
              <FaCog style={{ marginRight: "8px" }} /> Profile Settings
            </MenuItem>
            <MenuItem onClick={() => navigate(main.changePassword)}>
              <FaLock style={{ marginRight: "8px" }} /> Change Password
            </MenuItem>
            <MenuItem onClick={setOpenThemeDrawer}>
              <FaPalette style={{ marginRight: "8px" }} /> Customize Theme
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                doLogout();
                navigate(authentication.login);
              }}
              // colorScheme="red"
            >
              <FaSignOutAlt style={{ marginRight: "8px" }} /> Logout
            </MenuItem>
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
          boxShadow="md"
          borderRadius="md"
          zIndex={10}
          p={2}
        >
          <VStack spacing={2}>
            <MenuItem
              onClick={() => navigate(authentication.login)}
              display="flex"
              alignItems="center"
            >
              <Icon as={FaUser} boxSize={6} mr={2} color="blue.500" />
              <Text>Login</Text>
            </MenuItem>
            <MenuItem
              onClick={() => navigate(authentication.createOrganisationStep1)}
              display="flex"
              alignItems="center"
            >
              <Icon as={FaKey} boxSize={6} mr={2} color="blue.500" />
              <Text>Create New Account</Text>
            </MenuItem>
          </VStack>
        </MenuList>
      </Portal>
    </Menu>
  );
});

export default HeaderProfile;
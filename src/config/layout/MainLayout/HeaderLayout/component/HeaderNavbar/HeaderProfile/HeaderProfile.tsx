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
  Button,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import store from "../../../../../../../store/store";
import { useLocation, useNavigate } from "react-router-dom";
import {
  authentication,
  dashboard,
  main,
} from "../../../../../../constant/routes";
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
  const { pathname } = useLocation();
  const {
    auth: { user, doLogout },
    themeStore: { setOpenThemeDrawer },
  } = store;
  const navigate = useNavigate();

  const renderMenuItem = (label : any, icon : any, onClick : any) => (
    <MenuItem onClick={onClick} icon={<Box as={icon} mr={3} />}>
      {label}
    </MenuItem>
  );

  return user ? (
    <Menu closeOnSelect={false} placement="bottom-end">
      <MenuButton
        as={IconButton}
        aria-label="User Menu"
        icon={
          <Avatar
            src={user?.pic?.url || undefined}
            width="42px"
            height="42px"
            borderRadius="full"
            name={user?.name}
          />
        }
        size="sm"
        variant="ghost"
      />
      <MenuList
        minWidth="220px"
        boxShadow="md"
        borderRadius="md"
        zIndex={10}
        p={2}
      >
        <VStack spacing={2} align="stretch">
          <Box textAlign="center">
            <Avatar
              src={user?.pic?.url || undefined}
              size="lg"
              name={user?.name}
            />
            <Text mt={2} fontWeight="bold">
              {user?.name}
            </Text>
          </Box>
          <Divider />
          {user && pathname !== main.home && renderMenuItem("Home", FaHome, () => navigate(main.home))}
          {renderMenuItem("Profile Settings", FaCog, () => navigate(main.profile))}
          {renderMenuItem("Dashboard", FaKey, () => navigate(dashboard.home))}
          {renderMenuItem("Change Password", FaLock, () => navigate(main.changePassword))}
          {renderMenuItem("Customize Theme", FaPalette, setOpenThemeDrawer)}
          <Divider />
          <MenuItem
            onClick={() => {
              doLogout();
              navigate(authentication.login);
            }}
            icon={<Box as={FaSignOutAlt} mr={3} />}
          >
            Logout
          </MenuItem>
        </VStack>
      </MenuList>
    </Menu>
  ) : (
    <Menu closeOnSelect={false} placement="bottom-end">
      <MenuButton variant="ghost" border="2px solid" as={Button}>
        Login
      </MenuButton>
      <MenuList
        minWidth="220px"
        boxShadow="md"
        borderRadius="md"
        zIndex={10}
        p={2}
      >
        <VStack spacing={3} align="stretch">
          {renderMenuItem("Login", FaUser, () => navigate(authentication.login))}
          <Divider />
          {renderMenuItem("Create New Account", FaKey, () =>
            navigate(authentication.createOrganisationStep1)
          )}
        </VStack>
      </MenuList>
    </Menu>
  );
});

export default HeaderProfile;

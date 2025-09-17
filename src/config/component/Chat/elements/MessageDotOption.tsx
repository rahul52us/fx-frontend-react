import { Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { FaEllipsisH } from "react-icons/fa";
import { textColor, whiteTextColor } from "../../../../globalColors";

interface MessageDotOptionProps {
  user: any; // Replace 'any' with a more specific type if available
}

const MessageDotOption = observer(({ user }: MessageDotOptionProps) => {  
  return (
    <Menu closeOnSelect={false} placement="bottom-end">
      <MenuButton
        as={Flex}
        alignItems="center"
        justifyContent="center"
        cursor="pointer"
        _hover={{ opacity: 0.8 }}
        fontSize="xl"
      >
        <FaEllipsisH fontSize={'xs'} color={user.me ?whiteTextColor: textColor}/>
      </MenuButton>
      <MenuList
        minWidth="180px"
        boxShadow="md"
        py={1}
        borderRadius="md"
        zIndex={10}
      >
        <MenuItem
          px={4}
          py={2}
          fontSize="sm"
          fontWeight="medium"
          onClick={() => {
            localStorage.setItem("profile_current_active_tab", "0");
          }}
        >
          Profile Settings
        </MenuItem>
        <MenuItem px={4} py={2} fontSize="sm" fontWeight="medium">
          Change Password
        </MenuItem>
        <MenuItem px={4} py={2} fontSize="sm" fontWeight="medium">
          Customize Theme
        </MenuItem>
        <MenuItem
          px={4}
          py={2}
          fontSize="sm"
          fontWeight="medium"
          color="red.500"
        >
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
});

export default MessageDotOption;

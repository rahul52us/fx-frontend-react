import {
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useColorModeValue,
} from "@chakra-ui/react";
import "./styles.css";
import { useNavigate } from "react-router-dom";

const Header = ({ title, Menus, link }: any) => {
  const navigate = useNavigate();
  const hoverColor = useColorModeValue("blue.50", "whiteAlpha.200");
  return (
    <Popover trigger="hover" placement="bottom">
      <PopoverTrigger>
        <Text
          px={3}
          py={1}
          rounded={"full"}
          _hover={{
            bg: hoverColor,
            // textDecoration: "underline",
            color: "blue.500",
            animation: "slideFromLeft 0.3s ease forwards",
          }}
          fontSize="16px"
          cursor="pointer"
          fontWeight="500"
          className="animated-text"
          transition="all 0.2s ease-in-out"
          onClick={() => {
            if (link && !Menus) {
              navigate(link);
            }
          }}
        >
          {title}
        </Text>
      </PopoverTrigger>
      {Menus && (
        <PopoverContent mt={5}>
          <PopoverBody borderRadius={0}>{<Menus />}</PopoverBody>
        </PopoverContent>
      )}
    </Popover>
  );
};

export default Header;

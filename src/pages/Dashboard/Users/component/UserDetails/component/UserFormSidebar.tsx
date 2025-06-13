import { observer } from "mobx-react-lite";
import {
  Box,
  Text,
  VStack,
  Link,
  Divider,
  useColorMode,
  Icon,
} from "@chakra-ui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { dashboard } from "../../../../../../config/constant/routes";
import { sideTabs } from "./utils/constant";
import React from "react";
import { FiFileText, FiUser } from "react-icons/fi";
import { HiOutlineBriefcase, HiOutlineOfficeBuilding } from "react-icons/hi";
import { RiBankLine } from "react-icons/ri";
import { FaHome } from "react-icons/fa";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

const UserFormSidebar = observer(({ type }: any) => {
  const { colorMode } = useColorMode();
  const location = useLocation();
  const navigate = useNavigate();
  const tab: any = new URLSearchParams(location.search).get("tab");
  const { id } = useParams();

  const handleChange = (tab: string) => {
    if (type === "edit") {
      navigate(`${dashboard.Users.details}/edit/${id}?tab=${tab}`);
    } else {
      navigate(`${dashboard.Users.details}/new?tab=${tab}`);
    }
  };
  const icons = [
    FiUser,
    HiOutlineOfficeBuilding,
    RiBankLine,
    FaHome,
    FiFileText,
    HiOutlineBriefcase,
    MdOutlineAdminPanelSettings,
  ];

  return (
    <Box
      p={4}
      bg={colorMode === "light" ? "white" : "gray.700"}
      borderRadius="lg"
      boxShadow="lg"
      height="100%"
      border="1px solid"
      borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
      position={"sticky"}
      top={0}
      h={"fit-content"}
    >
      <VStack spacing={4} align="stretch">
        <Text
          fontSize="2xl"
          fontWeight="bold"
          bgGradient="linear(to-r, blue.400, blue.600)"
          bgClip="text"
        >
          User Details
        </Text>
        <VStack spacing={3} align="stretch">
          {sideTabs.map((item: any, index: number) => (
            <React.Fragment key={index}>
              <Link
                onClick={() => handleChange(item.key)}
                fontSize="md"
                color={tab === item.key ? "blue.600" : "gray.400"}
                fontWeight={tab === item.key ? "bold" : "medium"}
                _hover={{ color: "blue.600", textDecoration: "none" }}
                _focus={{ boxShadow: "outline" }}
                transition="all 0.2s"
                display="flex"
                cursor="pointer"
                alignItems="center"
                gap={3}
              >
                <Icon as={icons[index]} boxSize={6} />
                {item.title}
              </Link>
              {index < sideTabs.length - 1 && (
                <Divider
                  borderWidth="1px"
                  borderColor={colorMode === "light" ? "gray.200" : "gray.600"}
                />
              )}
            </React.Fragment>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
});

export default UserFormSidebar;

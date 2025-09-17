import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { primaryColor, secondaryColor } from "../../../globalColors";

interface BreadcrumbItems {
  label: string;
  link?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItems[];
}

const CustomBreadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const separatorColor = useColorModeValue("gray.400", "gray.600");
  // const linkColor = useColorModeValue("blue.500", "blue.200");
  // const activeColor = useColorModeValue("gray.700", "gray.300");

  return (
    <Breadcrumb
      separator={
        <FiChevronRight color={separatorColor} size={8} />
      }
      fontSize="smaller"
      fontWeight="bold"
      ml={-6}
    >
      {items?.map((item, index) => (
        <BreadcrumbItem key={index} isCurrentPage={index === items.length - 1}>
          {item.link ? (
            <BreadcrumbLink
              as={Link}
              to={item.link}
              color={primaryColor}
              _hover={{ color: secondaryColor }}
              _focus={{ outline: "none" }}
              _active={{ color: primaryColor }}
            >
              {item.label}
            </BreadcrumbLink>
          ) : (
            <span style={{ color: primaryColor }}>{item.label}</span>
          )}
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
};

export default CustomBreadcrumb;

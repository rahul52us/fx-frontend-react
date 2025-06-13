import {
  Box,
  Link as ChakraLink,
  HStack,
  Icon,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import {
  FaBrain,
  FaCode,
  FaJsSquare,
  FaLaptopCode,
  FaPython,
  FaReact,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { main } from "../../../../../../constant/routes";

const CoursesMenus = () => {
  return (
    <Box maxW="350px">
      <VStack align="stretch" spacing={3}>
        <VStack align="stretch" spacing={3}>
          <Text fontWeight="bold" mt={1}>
            Popular Courses
          </Text>
          <CourseLink
            to={`${main.courses}`}
            icon={FaReact}
            label="Introduction to React"
          />
          <CourseLink
            to={`${main.courses}`}
            icon={FaJsSquare}
            label="JavaScript Fundamentals"
          />
          <CourseLink
            to={`${main.courses}`}
            icon={FaPython}
            label="Python for Beginners"
          />
        </VStack>
        <VStack align="stretch" spacing={3} mt={2}>
          <Text fontWeight="bold">Recent Courses</Text>
          <CourseLink
            to={`${main.courses}`}
            icon={FaLaptopCode}
            label="Data Structures and Algorithms"
          />
          <CourseLink
            to={`${main.courses}`}
            icon={FaBrain}
            label="Machine Learning Basics"
          />
          <CourseLink
            to={`${main.courses}`}
            icon={FaCode}
            label="Web Development Bootcamp"
          />
        </VStack>
      </VStack>
    </Box>
  );
};

const CourseLink = ({ to, icon, label }: any) => {
  const hoverBg = useColorModeValue("blue.50", "blue.900");
  const borderWidth = useColorModeValue(1, 0);
  return (
    <ChakraLink
      as={Link}
      to={to}
      _hover={{ textDecoration: "none", bg: hoverBg, transform: "scale(1.02)" }}
      transition="0.3s"
      bg="whiteAlpha.100"
      p={2}
      borderRadius="xl"
      display="block"
      boxShadow="sm"
      borderWidth={borderWidth}
      fontWeight="medium"
    >
      <HStack>
        <Icon as={icon} boxSize={5} color="blue.300" />
        <Text>{label}</Text>
      </HStack>
    </ChakraLink>
  );
};

export default observer(CoursesMenus);

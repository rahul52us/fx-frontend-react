import { Box, Flex, Image, Text } from "@chakra-ui/react";
import beauty from "./CategoryIcons/beauty.webp";
import clothing from "./CategoryIcons/clothing.webp";
import electronics from "./CategoryIcons/electronics.webp";
import furniture from "./CategoryIcons/furniture.webp";
import grocery from "./CategoryIcons/grocery.webp";
import kitchen from "./CategoryIcons/kitchen.webp";
import travel from "./CategoryIcons/travel.webp";

const categoryArray = [
  {
    id: 1,
    name: "Electronics",
    image: electronics,
  },
  {
    id: 2,
    name: "Beauty",
    image: beauty,
  },
  {
    id: 2,
    name: "Grocery",
    image: grocery,
  },
  {
    id: 2,
    name: "Kitchen",
    image: kitchen,
  },
  {
    id: 2,
    name: "Furniture",
    image: furniture,
  },
  {
    id: 2,
    name: "Clothing",
    image: clothing,
  },
  {
    id: 2,
    name: "Travel",
    image: travel,
  },
];

const ProductsCategory = () => {
  return (
    <Box py={4} mb={2} bg={"teal.600"} rounded={"2xl"}>
      <Flex gap={20} justify={"center"} mx={"auto"}>
        {categoryArray.map((value) => (
          <Flex
            align={"center"}
            key={value.id}
            direction={"column"}
            gap={1}
            cursor={"pointer"}
            _hover={{ transform: "scale(1.05)" }}
            transition="0.3s ease"
          >
            <Image
              src={value.image}
              bg={"white"}
              boxSize={16}
              p={2}
              rounded={"full"}
              shadow={"dark-lg"}
              border={"1px solid "}
              borderColor={"gray.200"}
            />
            <Text
              fontWeight={500}
              color={"white"}
              _hover={{ color: "teal.100" }}
            >
              {value.name}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};

export default ProductsCategory;

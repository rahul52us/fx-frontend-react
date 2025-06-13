import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Divider,
  Text,
  Flex,
  useColorModeValue,
  Icon,
  Wrap,
  WrapItem,
  Tag,
  Image,
} from "@chakra-ui/react";
import { FiChevronRight } from "react-icons/fi";
import BlogViewDetail from "./BlogViewDetail";
import BlogReaction from "./BlogReaction";
import { useNavigate } from "react-router-dom";
import BlogCommentIndex from "../../BlogComment/BlogCommentIndex";

const BlogViewContainer = ({ item, multi }: any) => {
  const navigate = useNavigate();

  // Theme-based styles
  const cardBg = useColorModeValue("white", "gray.800");
  const titleColor = useColorModeValue("blue.900", "blue.300");
  const subTitleColor = useColorModeValue("gray.600", "gray.400");
  const contentColor = useColorModeValue("gray.700", "gray.300");
  const dividerColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Card
      mb={[4, 6, 8]} // Responsive margin-bottom
      width="100%"
      borderRadius="xl"
      overflow="hidden"
      bg={cardBg}
      boxShadow="lg"
      transition="all 0.3s"
      _hover={{
        boxShadow: "2xl",
        transform: ["none", "none", "translateY(-5px)"], // Disable hover effect on mobile
      }}
    >
      {/* Cover Image Section */}
      {item?.coverImage?.url && (
        <Box
          height={{ base: "180px", md: "300px" }} // Responsive height
          position="relative"
        >
          <Image
            src={item.coverImage.url}
            alt={item.title || "Blog Cover"}
            width="100%"
            height="100%"
            objectFit="cover"
          />
        </Box>
      )}

      {/* Blog Details */}
      <CardHeader>
        <BlogViewDetail item={item} />
      </CardHeader>

      <Divider borderColor={dividerColor} />

      {/* Blog Content */}
      <CardBody p={[4, 6]}>
        {/* Blog Title */}
        <Heading
          as="h2"
          fontSize={{ base: "lg", md: "2xl" }}
          fontWeight="bold"
          color={titleColor}
          lineHeight={1.4}
          cursor={multi ? "pointer" : "default"}
          transition="color 0.3s"
          _hover={multi && { color: "blue.500" }}
          onClick={() => {
            if (multi) {
              navigate(`/blog/${item?.title.split(" ").join("-")}`, {
                state: item?._id,
              });
            }
          }}
        >
          {item?.title}
        </Heading>

        {/* Subtitle */}
        <Text
          mt={3}
          fontSize={{ base: "sm", md: "md" }}
          color={subTitleColor}
          noOfLines={multi ? 2 : undefined}
        >
          <div dangerouslySetInnerHTML={{ __html: item?.subTitle }} />
        </Text>

        {/* Blog Tags */}
        {item?.tags && (
          <Box mt={4}>
            <Wrap spacing={3}>
              {item.tags.map((tag: string, index: number) => (
                <WrapItem key={index}>
                  <Tag
                    size="sm" // Smaller tags for mobile
                    variant="subtle"
                    colorScheme="blue"
                    cursor="pointer"
                    _hover={{
                      bg: "blue.200",
                      color: "blue.900",
                      transform: "scale(1.05)",
                    }}
                  >
                    {tag}
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          </Box>
        )}

        {/* Blog Reactions */}
        <BlogReaction item={item} multi={multi} />

        {/* Full Content (single blog view only) */}
        {!multi && (
          <Box mt={5}>
            <Text fontSize={{ base: "sm", md: "md" }} color={contentColor}>
              <div dangerouslySetInnerHTML={{ __html: item?.content }} />
            </Text>
          </Box>
        )}

        {/* Read More (multi-blog view only) */}
        {multi && (
          <Flex mt={6} align="center">
            <Text
              fontSize={{ base: "sm", md: "lg" }}
              fontWeight="semibold"
              color="blue.500"
              cursor="pointer"
              onClick={() =>
                navigate(`/blog/${item?.title.split(" ").join("-")}`, {
                  state: item?._id,
                })
              }
            >
              Read More
            </Text>
            <Icon as={FiChevronRight} ml={2} color="blue.500" />
          </Flex>
        )}
      </CardBody>

      {/* Comments Section (single blog view only) */}
      {!multi && item && (
        <>
          <Divider borderColor={dividerColor} />
          <Box p={[4, 6]}>
            <BlogCommentIndex item={item} />
          </Box>
        </>
      )}
    </Card>
  );
};

export default BlogViewContainer;

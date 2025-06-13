import {
  Box,
  Text,
  useColorModeValue,
  VStack
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import store from "../../../../../../../store/store";

const BlogsMenus = observer(() => {
  const navigate = useNavigate();
  const {
    BlogStore: { getBlogs, blogs },
    auth: { openNotification },
  } = store;

  const hoverBg = useColorModeValue("blue.50", "blue.900");
  const borderWidth = useColorModeValue(1, 0);

  useEffect(() => {
    getBlogs({ page: 1, limit: 15 })
      .then(() => {})
      .catch((err: any) => {
        openNotification({
          title: "GET Blogs Failed",
          message: err.message,
          type: "error",
        });
      });
  }, [openNotification, getBlogs]);

  const blogCategories = [
    {
      title: "Latest Posts",
    },
  ];

  return (
    <Box>
      {blogCategories.map((category: any) => (
        <VStack key={category.title} align="stretch" spacing={2}>
          <Text fontWeight="bold"  mt={2}>
            {category.title}
          </Text>
          {blogs.data?.slice(0,3).map((blog: any, index: number) => (
            <Text
              cursor="pointer"
              transition="0.3s"
              _hover={{
                textDecoration: "none",
                bg: hoverBg,
                transform: "scale(1.02)",
              }}
              borderWidth={borderWidth}
              fontSize={"sm"}
              bg="whiteAlpha.100"
              p={2}
              borderRadius="xl"
              key={index}
              onClick={() => {
                navigate(`/blog/${blog?.title.split(" ").join("-")}`, {
                  state: blog?._id,
                });
              }}
            >
              {blog.title}
            </Text>
          ))}
        </VStack>
      ))}
    </Box>
  );
});

export default BlogsMenus;

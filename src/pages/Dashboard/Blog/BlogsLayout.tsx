import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useState } from "react";
import { useQueryParams } from "../../../config/component/customHooks/useQuery";
import store from "../../../store/store";
import { getStatusType } from "../../../config/constant/statusCode";
import { Box, Flex, Spinner, Text, Grid } from "@chakra-ui/react";
import MainPagePagination from "../../../config/component/pagination/MainPagePagination";
import BlogWidget from "./BlogWidget";

const BlogsLayout = observer(() => {
  const {
    auth: { openNotification },
    BlogStore: { getBlogs, blogs },
  } = store;

  const { getQueryParam, setQueryParam } = useQueryParams();
  const [currentPage, setCurrentPage] = useState(() =>
    getQueryParam("page") ? Number(getQueryParam("page")) : 1
  );

  const fetchBlogsDetails = useCallback(() => {
    getBlogs({ page: currentPage, limit: 10 })
      .then(() => {})
      .catch((err) => {
        openNotification({
          title: "Failed to Retrieve Blogs",
          message: err?.data?.message,
          type: getStatusType(err.status),
        });
      });
  }, [openNotification, currentPage, getBlogs]);

  useEffect(() => {
    fetchBlogsDetails();
  }, [fetchBlogsDetails]);

  const handlePageChange = (page: any) => {
    setCurrentPage(page.selected);
    setQueryParam("page", page.selected);
  };

  return (
    <Box py={8} px={6}>
      {/* Blog Cards Section */}
      {blogs.loading ? (
        <Flex justify="center" align="center" py={12}>
          <Spinner size="lg" />
        </Flex>
      ) : blogs.data?.length ? (
        <Grid gridTemplateColumns={{ base: '1fr', sm: '1fr', md: '1fr 1fr', xl: '1fr 1fr 1fr' }} gap={5}>
          {blogs.data.map((item: any, index: number) => (
            <BlogWidget blog={item} key={index} fetchBlogsDetails={fetchBlogsDetails}/>
          ))}
        </Grid>
      ) : (
        <Flex justify="center" align="center" py={12}>
          <Text fontSize="lg" fontWeight="bold" color="gray.500">
            No Blogs Found
          </Text>
        </Flex>
      )}

      {/* Pagination Section */}
      <Flex
        justifyContent="center"
        mt={8}
        display={blogs.data?.length ? undefined : "none"}
      >
        <MainPagePagination
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalPages={blogs.TotalPages}
        />
      </Flex>
    </Box>
  );
});

export default BlogsLayout;

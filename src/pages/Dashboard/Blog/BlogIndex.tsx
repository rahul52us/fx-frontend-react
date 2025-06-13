import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  IconButton,
  SimpleGrid,
  useBreakpointValue,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import DashPageHeader from "../../../config/component/common/DashPageHeader/DashPageHeader";
import { blogBreadCrumb } from "../utils/breadcrumb.constant";
import {
  FaHome,
  FaPlus,
  FaProjectDiagram,
  FaTasks,
  FaUsers,
} from "react-icons/fa";
import SummaryWidget from "../../../config/component/WigdetCard/SummaryWidget";
import { useNavigate } from "react-router-dom";
import { dashboard } from "../../../config/constant/routes";
import BlogsLayout from "./BlogsLayout";
import { useEffect, useState } from "react";
import store from "../../../store/store";

const BlogIndex = observer(() => {
  const [loading, setLoading] = useState(false);
  const [countData, setCountData] = useState({
    privateBlogs: 0,
    publicBlogs: 0,
    deletedBlogs: 0,
  });
  const {
    BlogStore: { getStatusCount },
  } = store;
  const navigate = useNavigate();
  const showIcon = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    setLoading(true);
    getStatusCount({})
      .then((data: any) => {
        setCountData(data?.data);
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, [getStatusCount]);

  const summaryData = [
    {
      label: "Public Blogs",
      value: countData?.publicBlogs,
      icon: FaProjectDiagram,
      colorScheme: "teal",
      description: "Total number of Public Blogs.",
      loading: loading,
    },
    {
      label: "Private Blogs",
      value: countData?.privateBlogs,
      icon: FaTasks,
      colorScheme: "blue",
      description: "Total number of Private Blogs",
      loading: loading,
    },
    {
      label: "InActive Blogs",
      value: countData?.deletedBlogs,
      icon: FaUsers,
      colorScheme: "purple",
      description: "The number of Deleted Blogs",
      loading: loading,
    },
  ];

  return (
    <Box p={2} borderRadius="lg" boxShadow="lg">
      <DashPageHeader
        breadcrumb={blogBreadCrumb.index}
      />

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={6}>
        {summaryData.map((data, index) => (
          <SummaryWidget
            key={index}
            label={data.label}
            value={data.value}
            icon={data.icon}
            colorScheme={data.colorScheme}
            description={data.description}
            loading={data.loading}
          />
        ))}
      </SimpleGrid>

      <Flex justifyContent="space-between" alignItems="center" mb={2}>
        <Heading
          display="flex"
          alignItems="center"
          fontSize={{ base: "xl", md: "2xl" }}
          color="teal.600"
        >
          <Icon as={FaHome} boxSize={6} mr={2} />
          Blogs
        </Heading>
        {showIcon ? (
          <IconButton
            title="Create Blog"
            aria-label="Create Blog"
            icon={<FaPlus />}
            colorScheme="teal"
          />
        ) : (
          <Flex columnGap={4}>
            <Button
              leftIcon={<FaPlus />}
              colorScheme="teal"
              variant="solid"
              size="lg"
              _hover={{ bg: "teal.600" }}
              _active={{ bg: "teal.700" }}
              _focus={{ boxShadow: "outline" }}
              onClick={() => navigate(dashboard.blog.create)}
            >
              CREATE BLOG
            </Button>
          </Flex>
        )}
      </Flex>
      <Box mt={2}>
        <BlogsLayout />
      </Box>
    </Box>
  );
});

export default BlogIndex;
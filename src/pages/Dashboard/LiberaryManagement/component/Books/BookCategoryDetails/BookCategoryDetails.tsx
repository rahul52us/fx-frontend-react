import { Box, Heading, SimpleGrid, Flex, Icon, Button } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useState, useCallback } from "react";
import { FaBook, FaPersonCircleQuestion } from "react-icons/fa6";
import MainPagePagination from "../../../../../../config/component/pagination/MainPagePagination";
import { getStatusType } from "../../../../../../config/constant/statusCode";
import store from "../../../../../../store/store";
import NotFoundData from "../../../../../../config/component/commonPages/NotFoundData";
import { useQueryParams } from "../../../../../../config/component/customHooks/useQuery";
import { FaBookOpen, FaBookReader, FaPlus } from "react-icons/fa";
import BookCategory from "./element/BookCategory";
import SummaryWidget from "../../../../../../config/component/WigdetCard/SummaryWidget";
import DashPageHeader from "../../../../../../config/component/common/DashPageHeader/DashPageHeader";
import { booksBreadCrumb } from "../../../../utils/breadcrumb.constant";
import BookDetailDrawer from "../BookDetailDrawers";
import { dashboard } from "../../../../../../config/constant/routes";
import PermissionDeniedPage from "../../../../../../config/component/commonPages/PermissionDeniedPage";
import { useNavigate } from "react-router-dom";
// import BookCard from "../BooksDetails/element/BookCard";

const BookDetails = observer(() => {
  const navigate = useNavigate()
  const {
    auth: { openNotification, checkPermission },
    bookLiberary: {
      getAllBooksCategory,
      booksCategory,
      handleBookCategoryForm,
      getBooksCounts,
      booksCounts,
      bookCategoryCount,
      bookUsersCount,
      getBooksCategoryCounts,
      getBookUsersCounts,
    },
  } = store;

  const { getQueryParam, setQueryParam } = useQueryParams();
  const [currentPage, setCurrentPage] = useState(() =>
    getQueryParam("page") ? Number(getQueryParam("page")) : 1
  );

  const fetchRecords = useCallback(
    (page: number = currentPage) => {
      getAllBooksCategory({ page, limit: 10 })
        .then(() => {})
        .catch((err: any) => {
          openNotification({
            title: "Failed to Retrieve Books Category",
            message: err?.data?.message,
            type: getStatusType(err.status),
          });
        });
    },
    [getAllBooksCategory, openNotification, currentPage]
  );

  useEffect(() => {
    fetchRecords(currentPage);
  }, [currentPage, fetchRecords]);

  const handlePageChange = (page: any) => {
    setCurrentPage(page.selected);
    setQueryParam("page", page.selected);
  };

  const fetchData = (getDataFn: any) =>
    new Promise((resolve, reject) => {
      getDataFn().then(resolve).catch(reject);
    });

  useEffect(() => {
    Promise.all([
      fetchData(getBooksCounts),
      fetchData(getBooksCategoryCounts),
      fetchData(getBookUsersCounts),
    ])
      .then(() => {})
      .catch((err: any) => {
        openNotification({
          title: "Failed to Retrieve Counts",
          message: err?.data?.message,
          type: getStatusType(err.status),
        });
      });
  }, [
    getBooksCounts,
    getBooksCategoryCounts,
    getBookUsersCounts,
    openNotification,
  ]);

  const summaryData = [
    {
      label: "Books Category",
      value: bookCategoryCount.data,
      loading: bookCategoryCount.loading,
      icon: FaBookReader,
      colorScheme: "teal",
      description: "Here is an description for the users",
      link:dashboard.liberary.books.category.index
    },
    {
      label: "Total Books",
      value: booksCounts.data,
      loading: booksCounts.loading,
      icon: FaBookOpen,
      colorScheme: "teal",
      description: "Total No. of Books Counts",
      link:dashboard.liberary.books.index
    },
    {
      label: "Total Users",
      value: bookUsersCount.data,
      loading: bookUsersCount.loading,
      icon: FaPersonCircleQuestion,
      colorScheme: "teal",
      description: "Here is an description for the users",
      link:dashboard.liberary.books.users
    },
  ];

  return (
    <PermissionDeniedPage
        show={!checkPermission("bookCategory", "view")}
        onClick={() => navigate(dashboard.home)}
      >
    <Box px={{ base: 2, md: 4 }}>
      <DashPageHeader
        title="Dashboard"
        breadcrumb={booksBreadCrumb.category}
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
            link={data.link}
          />
        ))}
      </SimpleGrid>
      <Flex mb={6} justifyContent={"space-between"}>
        <Heading
          display="flex"
          alignItems="center"
          fontSize={{ base: "xl", md: "2xl" }}
          color="teal.600"
        >
          <Icon as={FaBook} boxSize={6} mr={2} />
          Books Category
        </Heading>
        <Flex columnGap={4}>
          {checkPermission('bookCategory','add') &&  <Button
            leftIcon={<FaPlus />}
            colorScheme="teal"
            variant="solid"
            size="lg"
            _hover={{ bg: "teal.600" }}
            _active={{ bg: "teal.700" }}
            _focus={{ boxShadow: "outline" }}
            onClick={() =>
              handleBookCategoryForm({ open: true, data: null, type: "add" })
            }
          >
            Add Category
          </Button>}
        </Flex>
      </Flex>
      {booksCategory.data.length === 0 && !booksCategory.loading ? (
        <NotFoundData
          onClick={() =>
            handleBookCategoryForm({ open: true, data: null, type: "add" })
          }
          btnText="Add First Book"
          title="No Books found"
          subTitle="Start by creating a new book to get started."
        />
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={2} mb={8}>
          {booksCategory.data.map((item: any, index: number) => (
            <BookCategory
              item={item}
              key={index}
              onClick={(item: any, type: string) => {
                handleBookCategoryForm({ open: true, data: item, type: type });
              }}
            />
          ))}
        </SimpleGrid>
      )}
      <Flex justifyContent="center" mt={8}>
        <MainPagePagination
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalPages={booksCategory.totalPages}
        />
      </Flex>
      <BookDetailDrawer fetchRecords={fetchRecords} />
    </Box>
    </PermissionDeniedPage>
  );
});

export default BookDetails;

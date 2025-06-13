import { Box, Heading, SimpleGrid, Flex, Icon, Button } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useState, useCallback } from "react";
import { FaBook, FaPersonCircleQuestion } from "react-icons/fa6";
import MainPagePagination from "../../../../../../config/component/pagination/MainPagePagination";
import { getStatusType } from "../../../../../../config/constant/statusCode";
import store from "../../../../../../store/store";
import BookCard from "./element/BookCard";
import NotFoundData from "../../../../../../config/component/commonPages/NotFoundData";
import { useQueryParams } from "../../../../../../config/component/customHooks/useQuery";
import { FaBookOpen, FaBookReader, FaPlus } from "react-icons/fa";
import BookDetailDrawer from "../BookDetailDrawers";
import SummaryWidget from "../../../../../../config/component/WigdetCard/SummaryWidget";
import { dashboard } from "../../../../../../config/constant/routes";
import AddNewUserModel from "../../../../../../config/component/common/AddNewUserModel/AddNewUserModel";

const BookDetails = observer(() => {
  const [openUserModel, setOpenUserModel] = useState({
    user: undefined,
    open: false,
  });
  const [selectedBook, setSelectedBook] = useState<any>({});

  const {
    bookLiberary: {
      getBooksCounts,
      booksCounts,
      bookCategoryCount,
      bookUsersCount,
      getBooksCategoryCounts,
      getBookUsersCounts,
      getAllBooks,
      booksData,
      handleBookForm,
      handleBookCategoryForm,
    },
    auth: { openNotification, checkPermission },
    OrderStore: { setUserAddedItems },
  } = store;

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
    openNotification,
    getBooksCounts,
    getBooksCategoryCounts,
    getBookUsersCounts,
  ]);

  const { getQueryParam, setQueryParam } = useQueryParams();
  const [currentPage, setCurrentPage] = useState(() =>
    getQueryParam("page") ? Number(getQueryParam("page")) : 1
  );

  const fetchRecords = useCallback(
    (page: number = currentPage) => {
      getAllBooks({ page, limit: 10 })
        .then(() => {})
        .catch((err: any) => {
          openNotification({
            title: "Failed to Retrieve Books",
            message: err?.data?.message,
            type: getStatusType(err.status),
          });
        });
    },
    [getAllBooks, openNotification, currentPage]
  );

  useEffect(() => {
    fetchRecords(currentPage);
  }, [currentPage, fetchRecords]);

  const handlePageChange = (page: any) => {
    setCurrentPage(page.selected);
    setQueryParam("page", page.selected);
  };

  const summaryData = [
    {
      label: "Books Category",
      value: bookCategoryCount.data,
      loading: bookCategoryCount.loading,
      icon: FaBookReader,
      colorScheme: "teal",
      description: "Here is an description for the users",
      link: dashboard.liberary.books.category.index,
    },
    {
      label: "Total Books",
      value: booksCounts.data,
      loading: booksCounts.loading,
      icon: FaBookOpen,
      colorScheme: "teal",
      description: "Total No. of Books Counts",
      link: dashboard.liberary.books.index,
    },
    {
      label: "Total Users",
      value: bookUsersCount.data,
      loading: bookUsersCount.loading,
      icon: FaPersonCircleQuestion,
      colorScheme: "teal",
      description: "Here is an description for the users",
    },
  ];

  const handleAddUserUser = (users: any, books: any = {}) => {
    setOpenUserModel({ ...openUserModel, open: false });
    setUserAddedItems(
      "Books",
      {
        ...selectedBook,
        image: books?.coverImage?.url || selectedBook?.coverImage?.url,
        ...books,
        user: { username: users?.username, _id: users?._id }      },
      "add",
      {username : users?.username, _id : users?._id}
    );
  };

  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={6}>
        {summaryData.map((data, index) => (
          <SummaryWidget
            key={index}
            label={data.label}
            value={data.value}
            icon={data.icon}
            colorScheme={data.colorScheme}
            description={data.description}
            link={data.link}
            loading={data.loading}
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
          Books
        </Heading>
        <Flex columnGap={4}>
          {checkPermission("bookCategory", "add") && (
            <Button
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
            </Button>
          )}
          {checkPermission("books", "add") && (
            <Button
              leftIcon={<FaPlus />}
              colorScheme="teal"
              variant="solid"
              size="lg"
              _hover={{ bg: "teal.600" }}
              _active={{ bg: "teal.700" }}
              _focus={{ boxShadow: "outline" }}
              onClick={() =>
                handleBookForm({ open: true, data: null, type: "add" })
              }
            >
              Add Book
            </Button>
          )}
        </Flex>
      </Flex>
      {booksData.data.length === 0 && !booksData.loading ? (
        <NotFoundData
          onClick={() =>
            handleBookForm({ open: true, data: null, type: "add" })
          }
          btnText="Add First Book"
          title="No Books found"
          subTitle="Start by creating a new book to get started."
        />
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={8}>
          {booksData.data.map((item: any, index: number) => (
            <BookCard
              book={{ ...item, ratings: item.ratings || [] }}
              key={index}
              setSelectedBook={setSelectedBook}
              handleAddUserUser={handleAddUserUser}
              handleBookForm={(item: any, type: string) =>
                handleBookForm({ open: true, data: item, type: type })
              }
              setOpenUserModel={setOpenUserModel}
            />
          ))}
        </SimpleGrid>
      )}
      <Flex justifyContent="center" mt={8}>
        <MainPagePagination
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalPages={booksData.totalPages}
        />
      </Flex>
      <BookDetailDrawer fetchRecords={fetchRecords} />
      {
        <AddNewUserModel
          sendMailActive={false}
          open={openUserModel.open}
          close={() => setOpenUserModel({ ...openUserModel, open: false })}
          handleSubmit={({ values, setSubmitting }: any) => {
            setSubmitting(false);
            handleAddUserUser({
              _id: values?.user?.value,
              username: values?.user?.label,
            });
          }}
        />
      }
    </Box>
  );
});

export default BookDetails;

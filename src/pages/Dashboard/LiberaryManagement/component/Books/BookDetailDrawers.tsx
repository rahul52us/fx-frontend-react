import { observer } from "mobx-react-lite";
import CustomDrawer from "../../../../../config/component/Drawer/CustomDrawer";
import store from "../../../../../store/store";
import BookView from "./BooksDetails/forms/BookView";
import AddBook from "./BooksDetails/forms/AddBook";
import EditBook from "./BooksDetails/forms/EditBook";
import BookCategoryView from "./BookCategoryDetails/forms/BookCategoryView";
import AddBookCategory from "./BookCategoryDetails/forms/AddBookCategory";
import EditBookCategory from "./BookCategoryDetails/forms/EditBookCategory";

const BookDetailDrawer = observer(({ fetchRecords }: any) => {
  const {
    bookLiberary: {
      handleBookForm,
      bookForm,
      handleBookCategoryForm,
      bookCategoryForm,
    },
  } = store;

  return (
    <>
      <CustomDrawer
        open={bookForm.open}
        title={bookForm.type === "add" ? "CREATE NEW BOOK" : "UPDATE BOOK"}
        close={() => handleBookForm({ open: false, type: "add", data: null })}
        width={bookForm.type === "view" ? "75vw" : "90vw"}
      >
        {bookForm.type === "view" ? (
          <BookView data={bookForm.data} />
        ) : bookForm.type === "add" ? (
          <AddBook
            fetchRecords={fetchRecords}
            data={bookForm.data}
            close={() =>
              handleBookForm({ open: false, type: "add", data: null })
            }
          />
        ) : (
          <EditBook
            fetchRecords={fetchRecords}
            data={bookForm.data}
            close={() =>
              handleBookForm({ open: false, type: "add", data: null })
            }
          />
        )}
      </CustomDrawer>

      {/* Book Category Form Drawer */}

      <CustomDrawer
        open={bookCategoryForm.open}
        title={
          bookCategoryForm.type === "add"
            ? "CREATE NEW Category"
            : "UPDATE Category"
        }
        close={() =>
          handleBookCategoryForm({ open: false, type: "add", data: null })
        }
        width={bookCategoryForm.type === "view" ? "75vw" : "90vw"}
      >
        {bookCategoryForm.type === "view" ? (
          <BookCategoryView data={bookCategoryForm.data} />
        ) : bookCategoryForm.type === "add" ? (
          <AddBookCategory
            fetchRecords={fetchRecords}
            close={() =>
              handleBookCategoryForm({ open: false, type: "add", data: null })
            }
          />
        ) : (
          <EditBookCategory
            fetchRecords={fetchRecords}
            data={bookCategoryForm.data}
            close={() =>
              handleBookCategoryForm({ open: false, type: "add", data: null })
            }
          />
        )}
      </CustomDrawer>
    </>
  );
});

export default BookDetailDrawer;
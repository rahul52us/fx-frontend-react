import { observer } from "mobx-react-lite";
import DashPageHeader from "../../../config/component/common/DashPageHeader/DashPageHeader";
import { booksBreadCrumb } from "../utils/breadcrumb.constant";
import { Box } from "@chakra-ui/react";
import BookDetails from "./component/Books/BooksDetails/BookDetails";

const BookLiberary = observer(() => {
  return (
    <Box px={{ base: 2, md: 4 }}>
      <DashPageHeader
        title="Dashboard"
        breadcrumb={booksBreadCrumb.index}
      />
      <BookDetails />
    </Box>
  );
});

export default BookLiberary;

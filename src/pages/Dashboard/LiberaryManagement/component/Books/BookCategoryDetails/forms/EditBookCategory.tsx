import { observer } from "mobx-react-lite";
import store from "../../../../../../../store/store";
import { useEffect, useState } from "react";
import BookCategoryForm from "./BookCategoryForm";
import {
  generateBookCategoryInitialValues,
  generateSendBookCategoryResponse,
} from "../../utils/function";
import DrawerLoader from "../../../../../../../config/component/Loader/DrawerLoader";
import { readFileAsBase64 } from "../../../../../../../config/constant/function";
import { getStatusType } from "../../../../../../../config/constant/statusCode";

const EditBookCategory = observer(({ data, fetchRecords, close }: any) => {
  const [showError, setShowError] = useState(false);
  const {
    bookLiberary: { getSingleBookCategory, updateBookCategory },
    auth: { openNotification },
  } = store;
  const [fetchBookData, setFetchBookData] = useState<any>({
    data: null,
    loading: true,
  });

  useEffect(() => {
    setFetchBookData({ data: null, loading: true });
    getSingleBookCategory({ id: data._id })
      .then((data: any) => {
        console.log(data);
        setFetchBookData({ data: data?.data, loading: false });
      })
      .catch(() => {
        setFetchBookData({ data: null, loading: false });
      });
  }, [data, getSingleBookCategory]);

  const book = fetchBookData?.data;

  const handleSubmitForm = async ({
    values,
    setSubmitting,
    resetForm,
  }: any) => {
    try {
      let formData: any = {
        ...values,
      };

      if (
        formData?.coverImage?.file &&
        formData?.coverImage?.file?.length !== 0 &&
        formData?.coverImage?.isAdd
      ) {
        const buffer = await readFileAsBase64(formData?.coverImage?.file);
        const fileData = {
          buffer: buffer,
          filename: formData?.coverImage?.file?.name,
          type: formData?.coverImage?.file?.type,
          isDeleted: formData?.coverImage?.isDeleted || 0,
          isAdd: formData?.coverImage?.isAdd || 0,
        };
        formData.coverImage = fileData;
      } else {
        if (formData?.coverImage?.isDeleted) {
          const fileData = {
            isDeleted: formData?.coverImage?.isDeleted || 0,
            isAdd: formData?.coverImage?.isAdd || 0,
          };
          formData.coverImage = fileData;
        }
      }

      updateBookCategory(
        generateSendBookCategoryResponse({ ...formData, _id: book?._id })
      )
        .then((data) => {
          openNotification({
            title: "Successfully Updated",
            message: `${data.message}`,
            type: "success",
          });
          if (fetchRecords) {
            fetchRecords();
          }
          close();
          resetForm();
        })
        .catch((err: any) => {
          openNotification({
            title: "Update Failed",
            message: err?.data?.message,
            type: getStatusType(err.status),
          });
        })
        .finally(() => {
          setSubmitting(false);
        });
    } catch (err: any) {
      setSubmitting(false);
      console.log(err);
    }
  };

  return (
    <DrawerLoader
      loading={fetchBookData.loading}
      noRecordFoundText={!fetchBookData.data}
    >
      {book && (
        <BookCategoryForm
          initialValues={generateBookCategoryInitialValues(book)}
          showError={showError}
          isEdit={true}
          setShowError={setShowError}
          close={close}
          handleSubmit={handleSubmitForm}
        />
      )}
    </DrawerLoader>
  );
});

export default EditBookCategory;

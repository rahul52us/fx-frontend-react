import { observer } from "mobx-react-lite";
import BookForm from "./BookForm";
import { useEffect, useState } from "react";
import {
  generateBookInitialValues,
  generateSendBookResponse,
} from "../../utils/function";
import { readFileAsBase64 } from "../../../../../../../config/constant/function";
import store from "../../../../../../../store/store";
import { getStatusType } from "../../../../../../../config/constant/statusCode";
import DrawerLoader from "../../../../../../../config/component/Loader/DrawerLoader";

const EditBook = observer(({ close, data, fetchRecords }: any) => {
  const {
    auth: { openNotification },
    bookLiberary: { getSingleBook, updateBook },
  } = store;
  const [showError, setShowError] = useState(false);

  const [fetchBookData, setFetchBookData] = useState<any>({
    data: null,
    loading: true,
  });

  useEffect(() => {
    setFetchBookData({ loading: true, data: null });
    getSingleBook({ id: data?._id })
      .then((data: any) => {
        setFetchBookData({
          loading: false,
          data: data.data,
        });
      })
      .catch(() => {
        setFetchBookData({ loading: false, data: null });
      });
  }, [getSingleBook, data]);

  const book = fetchBookData.data;

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

      updateBook(generateSendBookResponse({ ...formData, _id: book?._id }))
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
        <BookForm
          initialValues={generateBookInitialValues(book)}
          showError={showError}
          setShowError={setShowError}
          close={close}
          handleSubmit={handleSubmitForm}
          isEdit={true}
        />
      )}
    </DrawerLoader>
  );
});

export default EditBook;

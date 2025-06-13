import { observer } from "mobx-react-lite";
import BookCategoryForm from "./BookCategoryForm";
import { useState } from "react";
import { generateBookCategoryInitialValues, generateSendBookCategoryResponse } from "../../utils/function";
import { readFileAsBase64 } from "../../../../../../../config/constant/function";
import store from "../../../../../../../store/store";
import { getStatusType } from "../../../../../../../config/constant/statusCode";

const AddBookCategory = observer(({close} :any) => {
  const {auth : {openNotification}, bookLiberary : {createBookCategory}} = store
  const [showError, setShowError] = useState(false);

  const handleSubmitForm = async({ values, setSubmitting, resetForm }: any) => {
    try {

      let formData = {
        ...values
      };

      if (values.coverImage?.file && values.coverImage?.file?.length !== 0) {
        const buffer = await readFileAsBase64(values.coverImage?.file);
        const fileData = {
          buffer: buffer,
          filename: values.coverImage?.file?.name,
          type: values.coverImage?.file?.type,
          isAdd : values.coverImage?.isAdd || 1
        };
        formData.coverImage = fileData;
      }

      createBookCategory(generateSendBookCategoryResponse({...formData}))
        .then((data) => {
          openNotification({
            title: "Successfully Created",
            message: `${data.message}`,
            type: "success",
          });
          close()
          resetForm();
        })
        .catch((err : any) => {
          openNotification({
            title: "Create Failed",
            message: err?.data?.message,
            type: getStatusType(err.status),
          });
        })
        .finally(() => {
          setSubmitting(false);
        });
    } catch (err: any) {
      setSubmitting(false)
    }
  };

  return (
    <BookCategoryForm
      initialValues={generateBookCategoryInitialValues()}
      showError={showError}
      setShowError={setShowError}
      close={close}
      handleSubmit={handleSubmitForm}
    />
  );
});

export default AddBookCategory;

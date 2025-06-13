import { observer } from "mobx-react-lite";
import CategoryForm from "./form/CategoryForm";
import { useState } from "react";
import store from "../../../../../../../store/store";
import { getStatusType } from "../../../../../../../config/constant/statusCode";
import FormModel from "../../../../../../../config/component/common/FormModel/FormModel";

const AddCategory = observer(({ openModel, setOpenModel, getAllRecords }: any) => {
  const {
    DepartmentStore: { addDepartmentCategory },
    auth: { openNotification },
  } = store;
  const [showError, setShowError] = useState(false);

  const closeModel = () => {
    setOpenModel({ open: false, loading: false, data : null, type : 'add' });
    setShowError(false);
  };

  const handleSubmit = ({ values, setSubmitting, resetForm }: any) => {
    addDepartmentCategory({ ...values, title : values.title?.trim(), code : values.code?.trim() })
      .then((data: any) => {
        openNotification({
          title: "Create Successfully",
          message: data?.message,
          type: "success",
        });
        getAllRecords({})
        resetForm();
        closeModel();
      })
      .catch((err: any) => {
        openNotification({
          title: "Create Failed",
          message: err?.data?.message,
          type: getStatusType(err.status),
        });
      })
      .finally(() => {
        setSubmitting(false);
        setShowError(false);
      });
  };

  return (
    <FormModel
      isCentered
      open={openModel.open && openModel.type === "add"}
      title="Add Title"
      footer={false}
      close={closeModel}
    >
      <CategoryForm
        initialValues={{
          title: "",
          code: ""
        }}
        close={closeModel}
        setShowError={setShowError}
        showError={showError}
        handleSubmit={handleSubmit}
      />
    </FormModel>
  );
});

export default AddCategory;

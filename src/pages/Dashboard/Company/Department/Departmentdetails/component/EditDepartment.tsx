import { observer } from "mobx-react-lite";
import CategoryForm from "./form/DepartmentForm";
import { useState } from "react";
import store from "../../../../../../store/store";
import FormModel from "../../../../../../config/component/common/FormModel/FormModel";
import { getStatusType } from "../../../../../../config/constant/statusCode";

const EditDepartment = observer(
  ({ openModel, setOpenModel, getAllRecords, selectedCategory }: any) => {
    const {
      DepartmentStore: { updateDepartment },
      auth: { openNotification },
    } = store;
    const [showError, setShowError] = useState(false);

    const closeModel = () => {
      setOpenModel({ open: false, loading: false, data: null, type: "add" });
      setShowError(false);
    };

    const handleSubmit = ({ values, setSubmitting, resetForm }: any) => {
      updateDepartment(openModel?.data?._id,{
        ...values,
        title: values?.title?.trim(),
        code: values?.code?.trim(),
        category:selectedCategory.id
      })
        .then((data: any) => {
          openNotification({
            title: "Updated Successfully",
            message: data?.message,
            type: "success",
          });
          getAllRecords({});
          resetForm();
          closeModel();
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
          setShowError(false);
        });
    };

    return (
      <FormModel
        isCentered
        open={openModel.open && openModel.type === "edit"}
        title={`${openModel?.data?.title} (${openModel?.data?.code})`}
        footer={false}
        close={closeModel}
        size="xl"
      >
        <CategoryForm
          initialValues={{
            title: openModel?.data?.title,
            code: openModel?.data?.code,
          }}
          close={closeModel}
          setShowError={setShowError}
          showError={showError}
          handleSubmit={handleSubmit}
        />
      </FormModel>
    );
  }
);

export default EditDepartment;

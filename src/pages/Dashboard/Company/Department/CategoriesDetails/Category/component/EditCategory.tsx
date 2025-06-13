import { observer } from "mobx-react-lite";
import CategoryForm from "./form/CategoryForm";
import { useState } from "react";
import store from "../../../../../../../store/store";
import { getStatusType } from "../../../../../../../config/constant/statusCode";
import FormModel from "../../../../../../../config/component/common/FormModel/FormModel";

const EditCategory = observer(
  ({ openModel, setOpenModel, getAllRecords }: any) => {
    const {
      DepartmentStore: { updateDepartmentCategory },
      auth: { openNotification },
    } = store;
    const [showError, setShowError] = useState(false);

    const closeModel = () => {
      setOpenModel({ open: false, loading: false, data: null, type: "add" });
      setShowError(false);
    };

    const handleSubmit = ({ values, setSubmitting, resetForm }: any) => {
      updateDepartmentCategory(openModel?.data?._id,{
        ...values,
        title: values?.title?.trim(),
        code: values?.code?.trim()
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

export default EditCategory;

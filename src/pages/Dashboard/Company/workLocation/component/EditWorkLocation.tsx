import { observer } from "mobx-react-lite";
import WorkLocationForm from "./form/WorkLocationForm";
import FormModel from "../../../../../config/component/common/FormModel/FormModel";
import { useState } from "react";
import store from "../../../../../store/store";
import { getStatusType } from "../../../../../config/constant/statusCode";

const EditWorkLocation = observer(
  ({ formValues, setFormValues, getAllRecords , policy, company}: any) => {
    const {
      company: { updateWorkLocation },
      auth: { openNotification },
    } = store;
    const [showError, setShowError] = useState(false);

    const closeModel = () => {
      setFormValues({ open: false, loading: false, data: null, type: "add" });
      setShowError(false);
    };

    const handleSubmit = ({ values, setSubmitting, resetForm }: any) => {
      updateWorkLocation({
        ...values,
        locationName: values?.locationName?.trim(),
        _id : formValues?.data?._id,
        oldLocation: formValues?.data?.locationName,
        ipAddress: values?.ipAddress?.trim(),
        isEdit: 1,
        policy,
        company
      })
        .then((data: any) => {
          openNotification({
            title: "Updated Successfully",
            message: data?.message,
            type: "success",
          });
          getAllRecords();
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
        open={formValues.open && formValues.type === "edit"}
        title={`${formValues?.data?.locationName}`}
        footer={false}
        close={closeModel}
      >
        <WorkLocationForm
          initialValues={{
            locationName: formValues?.data?.locationName,
            ipAddress: formValues?.data?.ipAddress,
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

export default EditWorkLocation;

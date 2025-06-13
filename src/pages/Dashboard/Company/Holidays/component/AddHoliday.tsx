import { observer } from "mobx-react-lite";
import HolidayForm from "./form/HolidayForm";
import FormModel from "../../../../../config/component/common/FormModel/FormModel";
import { useState } from "react";
import store from "../../../../../store/store";
import { getStatusType } from "../../../../../config/constant/statusCode";

const AddHoliday = observer(({ formValues, setFormValues, getAllRecords,policy, selectedCompany }: any) => {
  const {
    company: { updateHoliday },
    auth: { openNotification },
  } = store;
  const [showError, setShowError] = useState(false);

  const closeModel = () => {
    setFormValues({ open: false, loading: false, data : null, type : 'add' });
    setShowError(false);
  };

  const handleSubmit = ({ values, setSubmitting, resetForm }: any) => {
    updateHoliday({ ...values, title : values.title?.trim(), isAdd : 1, policy, company : selectedCompany })
      .then((data: any) => {
        openNotification({
          title: "Create Successfully",
          message: data?.message,
          type: "success",
        });
        getAllRecords()
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
      open={formValues.open && formValues.type === "add"}
      title="Add Holiday"
      footer={false}
      close={closeModel}
    >
      <HolidayForm
        initialValues={{
          title: "",
          date: new Date(),
          description: "",
        }}
        close={closeModel}
        setShowError={setShowError}
        showError={showError}
        handleSubmit={handleSubmit}
      />
    </FormModel>
  );
});

export default AddHoliday;

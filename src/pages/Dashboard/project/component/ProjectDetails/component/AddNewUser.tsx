import { observer } from "mobx-react-lite";
import FormModel from "../../../../../../config/component/common/FormModel/FormModel";
import { useState } from "react";
import store from "../../../../../../store/store";
import { getStatusType } from "../../../../../../config/constant/statusCode";
import { generateProjectInitialValues } from "../../utils/function";
import AddNewUserForm from "../../../../../../config/component/common/AddNewUserModel/AddNewUser";

const AddNewUser = observer(
  ({ type, title, open, close, item, setFetchProjectData }: any) => {
    const {
      Project: { addProjectMembers, getSingleProject },
      auth: { openNotification },
    } = store;
    const [showError, setShowError] = useState([]);

    const handleSubmit = ({ setSubmitting, values }: any) => {
      addProjectMembers({ _id: item?._id, user : values.user?.value, isActive : values?.isActive, type: type })
        .then((data: any) => {
          getSingleProject({ id: item?._id })
            .then((data: any) => {
              setFetchProjectData({
                data: generateProjectInitialValues(data.data),
              });
            })
            .catch(() => {
              setFetchProjectData({ loading: false, data: null });
            });
          openNotification({
            title: "Successfully Updated",
            message: `${data.message}`,
            type: "success",
          });
          close();
        })
        .catch((err) => {
          openNotification({
            title: "Update Failed",
            message: err?.data?.message,
            type: getStatusType(err.status),
          });
        })
        .finally(() => {
          setSubmitting(false);
        });
    };

    return (
      <FormModel
        title={`Add ${title} `}
        open={open}
        close={close}
        isCentered
        rest={{size :'sm'}}
      >
        <AddNewUserForm
          initialValues={{ user: undefined, isActive: true }}
          showError={showError}
          setShowError={setShowError}
          close={close}
          handleSubmit={handleSubmit}
        />
      </FormModel>
    );
  }
);

export default AddNewUser;

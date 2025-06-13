import { observer } from "mobx-react-lite";
import FormModel from "../../../../../../config/component/common/FormModel/FormModel";
import { useState } from "react";
import store from "../../../../../../store/store";
import { getStatusType } from "../../../../../../config/constant/statusCode";
import AddNewUserForm from "../../../../../../config/component/common/AddNewUserModel/AddNewUser";

const AddNewUser = observer(
  ({ type, title, open, close, item , setFetchData}: any) => {
    const {
      tripStore: { addTripMembers, getSingleTrip },
      auth: { openNotification },
    } = store;
    const [showError, setShowError] = useState([]);

    const handleSubmit = ({ setSubmitting, values }: any) => {
      addTripMembers({ _id: item?._id,user : values?.user?.value, isActive : values?.isActive , type: type })
        .then((data) => {
          getSingleTrip({ _id: item?._id })
            .then((dt) => {
              dt.attach_files = dt.attach_files ? dt?.attach_files?.map((it: any) => ({
                ...it,
                file: it.file ? [it.file] : undefined,
              })) : []
              setFetchData({
                data: dt
              });
              close();
            })
            .catch(() => {
              setFetchData({ loading: false, data: null });
            });
          openNotification({
            title: "Successfully Updated",
            message: `${data.message}`,
            type: "success",
          });
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
